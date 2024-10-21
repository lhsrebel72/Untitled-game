const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const fs = require('fs');

class WatchPlugin {

    constructor(config) {
        this.config = config;
        this.firstPassDone = false;
    }

    apply(compiler) {
        this.compiler = compiler;

        compiler.plugin('watch-run', (params, callback) => {
            if (!this.watcher) {
                this.startWatcher();
            }

            callback();
        });

        compiler.plugin('done', () => {
            this.firstPassDone = true;
        })
    }

    startWatcher() {
        this.watcher = chokidar.watch(this.config.paths, this.config.options);

        const run = debounce(this.runCompiler.bind(this), 500);

        this.watcher.on('add', (path) => { run() });
        this.watcher.on('change', (path) => { run() });
        this.watcher.on('unlink', (path) => { run() });
    }

    stopWatcher() {
        this.watcher.close();
    }

    runCompiler() {
        if (this.firstPassDone) {
            this.compiler.run(error => {
                if (error) {
                    this.stopWatcher();
                    throw error;
                }
            });
        }
    }
}

module.exports = WatchPlugin;
