const META = (property, content) => ({property, content});

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '닌텐도 스위치 정발을 축하하며 12/1',
    meta: [
      { charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{
				property: 'og:type',
				content: 'website'
			},
			{
				property: 'og:title',
				content: '닌텐도 스위치 12/1 정발 예정'
			},
			{
				property: 'og:title',
				content: '닌텐도 스위치 12/1 정발 축하'
			},
			{
				property: 'og:description',
				content: '다음날 12/1 닌텐도 스위치가 정발이 됩니다. 행복합니다.'
			},
			{
				property: 'og:image',
				content: 'http://www.seo-study.ga/switch.png'
			},
			{
				property: 'og:image:width',
				content: '600px'
			},
			{
				property: 'og:image',
				content: 'http://www.seo-study.ga/mariodot.png'
			},
			{
				property: 'og:image:width',
				content: '500px'
			},
			{
				property: 'og:url',
				content: 'http://www.seo-study.ga'
			},
			META('twitter:url', 'http://www.seo-study.ga'),
			META('twitter:card', 'summary'),
			META('twitter:title', '닌텐도 스위치 12/1 정발 예정 (트위터 카드)'),
			META('twitter:description', '다음날 12/1 닌텐도 스위치가 정발 소식을 트위터에 올려보왔습니다.'),
			META('twitter:image', 'http://www.seo-study.ga/switch.png')
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
