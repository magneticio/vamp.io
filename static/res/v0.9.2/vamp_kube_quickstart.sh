#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

vamp_version="0.9.2"

: "${NAMESPACE:=default}"
: "${VAMP_IMG:=magneticio/vamp:${vamp_version}-kubernetes}"
: "${VGA_YAML:=https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v${vamp_version}/vga.yml}"
: "${ETCD_YAML:=https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v${vamp_version}/etcd.yml}"
: "${ES_IMG:=magneticio/elastic:2.2}"

reset=$(tput sgr0)
red=$(tput setaf 1)
green=$(tput setaf 2)
yellow=$(tput setaf 3)

echo "${green}
╦  ╦╔═╗╔╦╗╔═╗  ╦╔═╦ ╦╔╗ ╔═╗╦═╗╔╗╔╔═╗╔╦╗╔═╗╔═╗  ╔═╗ ╦ ╦╦╔═╗╦╔═  ╔═╗╔╦╗╔═╗╦═╗╔╦╗
╚╗╔╝╠═╣║║║╠═╝  ╠╩╗║ ║╠╩╗║╣ ╠╦╝║║║║╣  ║ ║╣ ╚═╗  ║═╬╗║ ║║║  ╠╩╗  ╚═╗ ║ ╠═╣╠╦╝ ║
 ╚╝ ╩ ╩╩ ╩╩    ╩ ╩╚═╝╚═╝╚═╝╩╚═╝╚╝╚═╝ ╩ ╚═╝╚═╝  ╚═╝╚╚═╝╩╚═╝╩ ╩  ╚═╝ ╩ ╩ ╩╩╚═ ╩
${reset}"

if [ `kubectl config current-context` = "minikube" ]; then
  flag_minikube=1
else
  flag_minikube=0
fi

if [ ${flag_minikube} -eq 1 ]; then
    echo "${green}minikube  : ${yellow}yes${reset}"
fi

echo "${green}namespace : ${yellow}$NAMESPACE${reset}"
echo "${green}vga file  : ${yellow}$VGA_YAML${reset}"
echo "${green}etcd file : ${yellow}$ETCD_YAML${reset}"
echo "${green}ES image  : ${yellow}$ES_IMG${reset}"
echo "${green}Vamp image: ${yellow}$VAMP_IMG${reset}"
echo

error() {
    echo "${red}[ERROR] $1${reset}"
    echo
    exit 1
}

step() {
    echo "${yellow}[STEP] $1${reset}"
}

ok() {
    echo "${green}[OK] $1${reset}"
}

verify_kubectl() {
    step "Verifying kubectl install"
    export KUBECTL=$(which kubectl)

    if [ ! $? = 0 ]; then
        error "Kubectl not found, cannot continue"
    fi

    # verify the namespace
    ${KUBECTL} get ns ${NAMESPACE} &> /dev/null
    if [ ! $? = 0 ]; then
        step "Creating namespace: ${NAMESPACE}"
        kubectl create ns ${NAMESPACE} 1> /dev/null

        if [ ! $? = 0 ] ; then
            error "Cannot create namespace ${NAMESPACE}!"
        fi
    fi

    ok "Using namespace: ${NAMESPACE}"
}

install_yaml() {
    step "Creating ${1} in namespace ${NAMESPACE}"
    CREATION=$(${KUBECTL} --namespace ${NAMESPACE} create -f ${1} 2>&1)

    if [[ ${CREATION} == *"already exists"* ]] ; then
        error "Cannot apply ${1}, already present in ${NAMESPACE}"
    fi

    ok "$1 created successfully"
}

expose() {
    step "Exposing port $3/$2($4) for deployment $1 with type $5"
    EXPOSE_SVC=$(${KUBECTL} expose deployment $1 --protocol=$2 --port=$3 --name=$4 --type="$5" --namespace=${NAMESPACE} 2>&1)

    if [ ! $? = 0 ]; then
        error "Failed to expose port $3/$2 ($4). Deployment: $1"
    fi
}

run() {
    step "Running $1 ($2)"
    RUN_CMD=$(${KUBECTL} run $1 --image=$2 --namespace=${NAMESPACE} 2>&1)

    if [ ! $? = 0 ]; then
        error "Failed to run $1. Image: $2"
    fi

    ok "$1 is running"
}

install() {
    install_yaml ${ETCD_YAML}
    install_yaml ${VGA_YAML}

    # run and expose elasticsearch
    run elastic ${ES_IMG}
    expose "elastic" "TCP" 9200 "elasticsearch" "ClusterIP"
    expose "elastic" "UDP" 10001 "logstash" "ClusterIP"
    expose "elastic" "TCP" 5601 "kibana" "ClusterIP"

    # run and expose vamp
    run "vamp" ${VAMP_IMG}
    expose "vamp" "TCP" 8080 "vamp" "LoadBalancer"
}

# run the pre install
verify_kubectl

# run the installation on kubernetes
install

if [ ${flag_minikube} -eq 1 ]; then
  step "Polling minikube for Vamp URL (this might take a while)..."
  echo ${yellow}
  url=$(minikube service --url vamp)
  echo ${reset}

  if [ ! $? = 0 ]; then
      error "Failed to retrieve Vamp URL"
  fi

  [[ -n "$url" ]] \
      && ok "Quickstart finished, Vamp is running on $url" \
      && minikube service vamp &>/dev/null \
      || error "Couldn't get Vamp URL, please check logs for more info."
else
  step "Polling kubernetes for external IP of Vamp (this might take a while)..."

  # poll for the external ip address, give up after 10 attempts
  external_ip=""
  for (( i=0; i<=9; i++ )) ; do
      [[ -n "$external_ip" ]] && break
      sleep 20

      external_ip=$(${KUBECTL} --namespace ${NAMESPACE} get svc vamp --template="{{range .status.loadBalancer.ingress}}{{.ip}}{{end}}")

      if [ ! $? = 0 ]; then
          error "Failed to retrieve external Vamp IP"
      fi

      step "Still polling for Vamp IP..."
  done

  [[ -n "$external_ip" ]] \
      && ok "Quickstart finished, Vamp is running on http://$external_ip:8080" \
      || error "Couldn't get Vamp IP, please check logs for more info."
fi
