const path                 = require('path');
const CopyPlugin           = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin    = require("html-webpack-plugin");
const variableList         = require('./src/variables.js');

module.exports = (env) => {
    let environment = env.production === true
        ? 'production'
        : 'development'

    return {
        mode: environment,
        entry: {
            app: ['./src/app.js', './src/app.scss']
        },
        devtool: environment === 'production' ? 'hidden-source-map' : 'inline-source-map',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
            // publicPath: "",
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.hbs$/,
                    use: [ 
                        { 
                            loader: 'handlebars-loader', 
                            //options: { inlineRequires: 'img\/' } 
                        },
                        // { loader: 'html-loader' },
                        // { loader: 'extract-loader' },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader, // fallback to "style-loader" in development
                        { loader: "css-loader", options: { sourceMap: true } },
                        {
                            loader: "sass-loader",
                            options: {
                              implementation: require("dart-sass")
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|webp|svg|ttf|woff|woff2)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: (name) => {
                            /**
                             * Obtém o nome do diretório original do artefato
                             * Original: 'src/images/subdir/image.jpg'
                             * Obtido:   'images/subdir'
                             */
                            let path = name.filename.split("/").slice(1, -1).join("/");

                            if (/fortawesome/.test(path) === true) {
                                path = 'fonts'
                            }

                            return `${path}/[name][ext]`;
                        },
                    },
                }
            ],
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    'src/CNAME',
                    { from: 'src/img/*.png', to: "/application/dist/img/[name][ext]" },
                ],
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new HtmlWebpackPlugin({
                template: "src/view/index/page.hbs",
                filename: 'index.html',
                templateParameters: Object.assign({}, variableList, variableList.pageIndex)
            })
            // new HtmlWebpackPlugin({
            //     template: "src/view/consultancy/page.hbs",
            //     filename: 'treinamento-consultoria.html',
            //     templateParameters: Object.assign({}, variableList, variableList.pageConsultancy)
            // }),
            // new HtmlWebpackPlugin({
            //     template: "src/view/homecare/page.hbs",
            //     filename: 'assistencia-domiciliar.html',
            //     templateParameters: Object.assign({}, variableList, variableList.pageHomeCare)
            // }),
            // new HtmlWebpackPlugin({
            //     template: "src/view/our-story/page.hbs",
            //     filename: 'nossa-historia.html',
            //     templateParameters: Object.assign({}, variableList, variableList.pageOurStory)
            // }),
            // new HtmlWebpackPlugin({
            //     template: "src/view/wounds/page.hbs",
            //     filename: 'tratamento-feridas.html',
            //     templateParameters: Object.assign({}, variableList, variableList.pageWounds)
            // })
        ],
    }
};
