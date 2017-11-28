<template>
  <section class="container">
    <div>
			<div class="mario-wrapper">
				<vue-mario
					class="ms"
					v-for="theme of ['', 'mexico', 'amiibo', 'winter']"
					:avatar="theme"
					:key="theme"></vue-mario>
			</div>
			<img class="w" src="~assets/swtich.png" alt="">
      <h1 class="title">
        닌텐도 스위치 정발
      </h1>
      <h2 class="subtitle">
        12/1
      </h2>
			<h2 class="links">
				<a href="http://www.nintendo.co.kr/main.php" class="button--green">한국 닌텐도</a>
			</h2>
      <!-- <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" class="button--grey">GitHub</a>
      </div> -->
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import Logo from '~/components/Logo.vue'
import VueMario from '~/components/Vue-mario.vue'

export default {
  components: {
		Logo,
		VueMario
  }
}
/* eslint-disable */
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

@keyframes move {
	0% {left: -600px;}
	100% {left: 600px;}
} 

.mario-wrapper {
	position: relative;
	top: 30px;
	overflow-x: hidden;
	overflow-y: auto;
}

.ms {
	margin: 0 10px;
	position: relative;
	animation: move 20s infinite linear;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #48b0dd;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #48b0dd;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
