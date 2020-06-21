
let Focus = (function() {
  let focus = 0;

  return {
    isLocked: function() {
      return focus > 0;
    },
    isUnlocked: function() {
      return focus <= 0;
    },
    lock: function() {
      focus += 1;
      if (focus > 0 && this.onLocked) {
        this.onLocked();
      }
      console.log(focus);
    },
    unlock: function() {
      focus -= 1;
      if (focus <= 0 && this.onUnlocked) {
        this.onUnlocked();
      }
      console.log(focus);
    },
  };
})();

module.exports = Focus;