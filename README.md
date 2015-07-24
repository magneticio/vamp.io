# Vamp.io
---

This is the source for the [vamp.io](http://vamp.io) site. This site is created using the static site generator
[Hugo](http://gohugo.io) and published to this repo's `gh-pages` branch. The DNS then points to a specific github 
address using a CNAME record, more info in [Github's documentation](https://github.com). However, if you want to work on the site you just need clone this repo and
follow the instructions below.

## Writing content
    
1. Clone this repo
    
        $ git clone https://github.com/magneticio/vamp.io.git
        
2. Download Hugo from [http://gohugo.io](http://gohugo.io) or install using Homebrew:
    
        $ brew install hugo

3. Run hugo in watch mode and start adding content under the `content/` tree

        $ hugo server --watch

    The site is server under `localhost:1313`

4. Publishing is done through Wercker. Just commit your changes to **master** and do a `git push`.

 


