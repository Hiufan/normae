var fis = module.exports = require('fis3');
fis.require.prefixes.unshift('normae');
fis.cli.name = 'normae';
fis.cli.info = require('./package.json');

/******************** dev start ********************/

//dep文件夹为bower的下载目录，有大量的冗余资源，可能导致编译失败。
//因此编译时屏蔽该目录，但是会自动找出其中被引用的资源。
fis.set('project.files', ['!dep/**']);

//模块加载采用amd方案，对应在fis中使用fis3-hook-amd插件。
//fis3-hook-amd：https://github.com/fex-team/fis3-hook-amd
fis.hook('amd', {
    globalAsyncAsSync: true,
    paths: {
        dep: '/dep'
    }
});

//less的混合样式文件，只会被其他less文件import，因此不需要单独发布。
fis.match(/^(.*)mixin\.less$/i,{
    release: false
});

fis.match('*.less', {
    parser: fis.plugin('less'),
    rExt: '.css'
});

fis.match('*.js', {
    isMod: true
});

//esl.js是实现了amd规范子集的模块加载器，只有isMod设置为false，才不会被fis当作模块解析。
//esl.js：https://github.com/ecomfe/esl
fis.match('esl.js', {
    isMod: false
});

//本地开发期间，velocity模版需要结合mock文件被编译成html文件，需要fis3-parser-vm插件。
//fis3-parser-vm：https://github.com/vicerwang/fis3-parser-vm
fis.match('**/page/**.html', {
    parser: fis.plugin('vm')
});

fis.match('**/*', {
    release: '/static/$0'
});

fis.match('*.html', {
    useCache: false,
    release: '/template/$0'
});

fis.match('/mock/**', {
    release: '/$0'
});

//前端模版文件需要压缩处理下，依赖fis-optimizer-html-minifier插件。
//html-minifier： https://github.com/kangax/html-minifier
//另外在编译期会被内嵌入js文件中，因此不需要发布。
fis.match('*.tpl',{
    optimizer: fis.plugin('html-minifier'),
    release : false
});

//velocity模版对应的mock数据不需要发布。
fis.match('*.html.js', {
    release: false
});

//bower的package文件不需要发布。
fis.match('bower.json', {
    release: false
});

//本地调试时，需要将server.conf文件发布到config文件夹下。
fis.match('server.conf', {
    release: '/config/server.conf'
});

//打包的资源类型设置为amd，需要fis3-postpackager-loader插件。
//fis3-postpackager-loader：https://github.com/fex-team/fis3-postpackager-loader
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        resourceType: 'amd',
        useInlineMap: true
    })
});

/******************** dev end ********************/


/******************** qa start ********************/

fis.media('qa').match('*.{css,js}', {
    useHash: true
});

fis.media('qa').match('::image', {
    useHash: true
});

fis.media('qa').match('*.{less,css}', {
    useSprite: true
});

fis.media('qa').match('**/page/**.html', {
    parser: null
});

fis.media('qa').match('**/mock/**', {
    release: false
});

fis.media('qa').match('server.conf', {
    release: false
});

fis.media('qa').match('::package', {
    spriter: fis.plugin('csssprites'),
    postpackager: fis.plugin('loader', {
        resourceType: 'amd',
        useInlineMap: true,
        allInOne: true
    })
});

/******************** qa end ********************/


/******************** prod start ********************/

fis.media('prod').match('*.{css,js}', {
    useHash: true
});

fis.media('prod').match('::image', {
    useHash: true
});

fis.media('prod').match('*.{less,css,html:css}', {
    useSprite: true,
    optimizer: fis.plugin('clean-css')
});

fis.media('prod').match('*.png', {
    optimizer: fis.plugin('png-compressor')
});

fis.media('prod').match('*.{js,html:js}', {
    optimizer: fis.plugin('uglify-js', {
        mangle: {
            except: 'exports, module, require, define'
        }
    })
});

fis.media('prod').match('**/page/**.html', {
    parser: null
});

fis.media('prod').match('**/mock/**', {
    release: false
});

fis.media('prod').match('server.conf', {
    release: false
});

fis.media('prod').match('::package', {
    spriter: fis.plugin('csssprites'),
    postpackager: fis.plugin('loader', {
        resourceType: 'amd',
        useInlineMap: true,
        allInOne: true
    })
});

/******************** prod end ********************/
