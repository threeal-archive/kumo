'use strict';
console.log('loaded');
function createElement(type, callback) {
  let element = document.createElement(type);
  element = callback(element);
  return element;
}

document.addEventListener('DOMContentLoaded', function() {
  var navExtended = document.createElement('nav');
  navExtended.className = 'nav-extended';

  var navContainer = document.createElement('div');
  navContainer.className = 'container';

  document.body.insertBefore(
    createElement('nav', (e) => {
      e.className = 'nav-extended';
      e.appendChild(createElement('div', (e) => {
        e.className = 'container';
        e.appendChild(createElement('div', (e) => {
          e.className = 'nav-weapper';
          e.appendChild(createElement('div', (e) => {
            e.className = 'col s12';
            let paths = window.location.pathname.split('/');
            if (window.location.pathname == '/')
              paths = ['/']
            let first = true;
            let fullPath = ''
            paths.forEach((path, index) => {
              e.appendChild(createElement('a', (e) => {
                e.className = 'breadcrumb';
                if (first) {
                  first = false;

                  if (index != paths.length - 1)
                    e.href = '/';
                  e.innerHTML += 'home';
                }
                else {
                  fullPath += '/' + path;
                  if (index != paths.length - 1)
                    e.href = fullPath;
                  e.innerHTML += path;
                }
                return e;
              }));
            });
            console.log();
            return e;
          }));
          return e;
        }));
        return e;
      }));
      return e;
    }),
    document.body.firstChild
  );
});
