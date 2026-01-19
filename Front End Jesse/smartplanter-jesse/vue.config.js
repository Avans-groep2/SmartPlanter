const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://smartplanters.dedyn.io:1880',
        changeOrigin: true,
        secure: false, // belangrijk bij HTTPS backend zonder volledig certificaat
        pathRewrite: path => path.replace(/^\/api/, '/smartplantdata'),
      },
    },
  },
})
