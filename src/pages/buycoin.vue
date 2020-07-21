<template>
  <section id="indexbox" class="container indexcolor">
    <div class="backcg">

    </div>
    <div class="toplayer">
      <div style="display: inline-flex;">
        <span style="color:white; margin-top: 30px;font-size: 0.89em;font-weight: bold;">BTC:</span>
      </div>
      <h2 class="subtitle">
        {{description}}
      </h2>
      <div class="links">
        <nuxt-link to="/buycoin" class="button--green">Get TOKEN</nuxt-link>
        <nuxt-link to="/dice" class="button--green">Free Dice</nuxt-link>
        <nuxt-link to="/raffle" class="button--grey">Free Mine</nuxt-link>
        <nuxt-link to="/play" class="button--grey">Login Play</nuxt-link>
      </div>
    </div>
  </section>
</template>
