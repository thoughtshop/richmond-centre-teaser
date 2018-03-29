# Thought Shop HAML/SASS/Bootstrap 3 development template

## Status
<a href="https://github.com/thoughtshop/haml-sass-boilerplate/"><img src="https://img.shields.io/badge/ver-1.00-brightgreen.svg"/></a>
<a href="https://github.com/thoughtshop/haml-sass-boilerplate/"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg"/></a>
<a href="https://github.com/thoughtshop/haml-sass-boilerplate/"><img src="https://img.shields.io/github/downloads/thoughtshop/ham-sass-boilerplate/total.svg"/></a>

## Key Dependency Status
HAML | SASS | Bootstrap 3 | Modernizr | Font Awesome

<a href="https://badge.fury.io/rb/haml"><img src="https://badge.fury.io/rb/haml.svg" alt="HAML Gem Version" height="18"></a>
<a href="https://badge.fury.io/rb/sass"><img src="https://badge.fury.io/rb/sass.svg" alt="SASS Gem Version" height="18"></a>
<a href="https://badge.fury.io/js/bootstrap"><img src="https://badge.fury.io/js/bootstrap.svg" alt="npm version" height="18"></a>
<a href="https://badge.fury.io/js/modernizr"><img src="https://badge.fury.io/js/modernizr.svg" alt="npm version" height="18"></a>
<a href="https://badge.fury.io/js/font-awesome"><img src="https://badge.fury.io/js/font-awesome.svg" alt="npm version" height="18"></a>


## Getting Started

1. Clone this repo using `git clone https://github.com/thoughtshop/ts-dev-template.git [new-project-folder-name]`
2. Move to the appropriate directory: `cd [new-project-folder-name]`.<br />
3. Run `yarn install` to install dependencies.<br />
4. Run `gulp`.<br />

*At this point you can see the app at `http://localhost:3000`.*

For production package run `gulp build --production`.

## Includes
1. HAML / SASS

2. Bootstrap 3
  - Style components are enabled/disabled in `app/styles/vendor.scss`
  - JS components are enabled/disabled in `.bootstraprc`

3. Modernizr
  - Options and feature detects can be added to `webpack.config.js`

4. Font Awesome

