#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

vamp_version="0.9.3"

: "${NAMESPACE:=default}"
: "${VGA_YAML:=https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v${vamp_version}/vga.yml}"
: "${ETCD_YAML:=https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v${vamp_version}/etcd.yml}"

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
echo

error() {
    echo "${red}[ERROR] $1${reset}"
    echo
    if [ ! "$2" = "no-exit" ]; then
      exit 1
    fi
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

    ok "Using namespace: ${NAMESPACE}"

    # verify the namespace
    ${KUBECTL} get ns ${NAMESPACE} &> /dev/null
    if [ ! $? = 0 ]; then
        error "Namespace ${NAMESPACE} was not found!"
    fi
}

delete() {
    step "Running delete command: $1"
    DELETE_CMD=$(${KUBECTL} --namespace ${NAMESPACE} delete $1)

    if [ ! $? = 0 ]; then
        error "Delete command ${1} has failed, skipping" "no-exit"
    fi
}

verify_kubectl

step "Uninstalling Vamp from namespace ${NAMESPACE}"

delete "-f ${ETCD_YAML}"
delete "-f ${VGA_YAML}"

delete "deployments,services,pods -l run=vamp"
delete "deployments,services,pods -l run=elasticsearch"
delete "deployments,services,pods -l run=kibana"
delete "deployments,services,pods -l io.vamp=daemon"
delete "deployments,services,pods -l io.vamp=gateway"
delete "deployments,services,pods -l io.vamp=workflow"
delete "deployments,services,pods -l io.vamp=daemon-set"
delete "deployments,services,pods -l io.vamp=deployment-service"
