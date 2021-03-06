'use strict';
import when from 'when';
import Path from 'path';
import _ from 'lodash';
import fs from 'fs';
import File from 'fs-extra';
import elegantSpinner from 'elegant-spinner';
import logUpdate from 'log-update';
import 'source-map-support/register';

let frame = elegantSpinner();

/**
 * The class that locates themes
 * @class  Theme
 */
class Theme {
  constructor(options) {

    let resolved = {
      theme: this.locateTheme(options.theme)
    };

    this.options = {
      theme: {
        name: resolved.theme.name,
        path: resolved.theme.path
      },
      target: {
        path: options.target
      }
    };

  }

  /**
   * Find the theme specified
   */
  locateTheme(theme) {

    const DEFAULT_THEME = 'mr-doc-theme-default';

    const mrDocPath = Path.resolve(__dirname, '..');
    const projectPath = process.cwd();

    const locations = {
      project: Path.join(projectPath,
        'node_modules',
        theme),
      mrDoc: Path.join(mrDocPath,
        'node_modules',
        theme),
      default: Path.join(mrDocPath,
        'node_modules',
        DEFAULT_THEME)
    };


    let exists = fs.existsSync(locations.mrDoc);
    if (exists) {
      console.log('mr-doc [info]: Using theme [' + theme + ']');
      return {
        name: theme,
        path: locations.mrDoc
      };
    }

    exists = fs.existsSync(locations.project);
    if (exists) {
      console.log('mr-doc [info]: Using theme [' + theme + ']');
      return {
        name: theme,
        path: locations.project
      };
    }

    console.log('mr-doc [warning]: theme "' +
      theme +
      '" not found, reverting to default.');

    return {
      name: DEFAULT_THEME,
      path: locations.default
    };

  }

  /**
   * Copies the theme specified (reverting to default)
   * over to the target directory.
   */
  static configure(options) {

      let final = when.defer();

      // Sources
      let config = {
        src: options.theme.path,
        dest: options.target.path,
        paths: {
          css: {
            src: 'assets/css',
            dest: 'css'
          },
          js: {
            src: 'assets/js',
            dest: 'js'
          }
        }
      };

      /**
       * The commands to install the theme
       * @type {object}
       */
      let commands = {
        showProgress: (command) => {
          var count = 0;
          while (count < 200) {
            logUpdate('mr-doc [info]: ' + frame() + ' ' + command);
            count++;
          }
        },
        /**
         * Create necessary paths to destination folder
         */
        copyAssets: () => {
          let types = _.keys(config.paths);
          let m = when.map(types, function (type) {
            let d = when.defer();
            let src = Path.join(config.src, config.paths[type].src);
            let dest = Path.join(config.dest, config.paths[type].dest);
            File.copy(src, dest, {
              clobber: true
            }, error => {
              if (error) d.reject(error);
              else {
                d.resolve();
              }
            });
            return d.promise;
          });
          return m;
        },
        /**
         * Reads the template from the source and strigifies it.
         */
        stringifyTemplate: () => {
          let d = when.defer();
          let file = Path.join(config.src, 'template/index.jade');
          File.readFile(file, (error, data) => {
            if (error) d.reject(error);
            else d.resolve({
              template: data.toString()
            });
          });
          return d.promise;
        }
      };

      // Check if the template is enabled (legacy)
      if (options.template && options.template.path) {
        final.resolve({
          template: File.readFileSync(
            Path.resolve(__dirname,
              options.template.path)).toString()
        });
      } else {
        (() => {
          return commands.copyAssets()
            .then(commands.stringifyTemplate)
            .then(final.resolve);
        })(commands.showProgress);
      }
      return final.promise;
    }
    /**
     * Copies the specific theme assets over to the target directory
     * and returns the
     */
  install() {
    return Theme.configure(this.options);
  }
}

export default Theme;
