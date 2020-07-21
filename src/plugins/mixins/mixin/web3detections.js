export default {
    data () {
        return {
            web3 : null,
        }
    },

    mounted () {
        this.web3 = this.$store.state.web3;
      /*  var k = web3object.isInjected && web3object.networkId === "main";
        if (k) {
            dat.signedinMain = true;
            dat.signedinTestNet = false;
        } else {
            dat.signedinMain = false;
            dat.signedinTestNet = true;
        }*/
    }
}