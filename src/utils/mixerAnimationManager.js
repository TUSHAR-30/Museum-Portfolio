class MixerAnimationManager {
    constructor() {
      this.mixers = [];
    }
  
    add(mixer) {
      this.mixers.push(mixer);
    }
  
    update(delta) {
      for (const mixer of this.mixers) {
        mixer.update(delta);
      }
    }
  }
  
  const mixerAnimationManager = new MixerAnimationManager();
  export default mixerAnimationManager;