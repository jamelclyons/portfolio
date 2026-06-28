module.exports = {
    browser: "google chrome",
    proxy: "http://localhost:3000",
    port: 3000,
    open: true,
    notify: false,
    files: [
      "dist/**/*.{html,js,css,scss,vue,jsx,tsx}",
    ],
    watch: true,
    cors: true,
    reloadOnRestart: true,
    notify: false,
    middleware: [
        function (req, res, next) {
            res.setHeader("Cache-Control", "no-store");
            next();
        },
    ],
    baseDir: "./",
    directory: true
};