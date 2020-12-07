randomPower = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const app = Vue.createApp({
  data() {
    return {
      max_p_health: 100,
      p_health: 100,
      m_health: 100,
      roundCount: 1,
      max_heal: 3,
      result: null,
      commentaries: [],
    };
  },
  computed: {
    mHealthStatus() {
      return { width: this.m_health + "%" };
    },
    pHealthStatus() {
      return { width: this.p_health + "%" };
    },
    unlockSpecialAttack() {
      return this.roundCount % 5 !== 0;
    },
    unlockHealPower() {
      return this.p_health === this.max_p_health || this.max_heal === 0;
    },
  },
  watch: {
    p_health(val) {
      if (val <= 0 && this.m_health <= 0) {
        this.result = "draw";
      } else if (val <= 0) {
        this.result = "lose";
      }
    },
    m_health(val) {
      if (val <= 0 && this.p_health <= 0) {
        this.result = "draw";
      } else if (val <= 0) {
        this.result = "win";
      }
    },
  },
  methods: {
    playGame() {
      this.p_health = 100;
      this.m_health = 100;
      this.roundCount = 1;
      this.max_heal = 3;
      this.result = null;
      this.commentaries = [];
    },
    attackMonster() {
      let power = randomPower(5, 15);
      this.roundCount++;
      this.m_health = Math.max(0, this.m_health - power);
      this.gameCommentaries("Player", "attack", power);
      this.attackPlayer();
    },
    attackPlayer() {
      let power = randomPower(5, 20);
      this.p_health = Math.max(0, this.p_health - power);
      this.gameCommentaries("Monster", "attack", power);
    },
    specialAttackMonster() {
      let power = randomPower(10, 30);
      this.roundCount++;
      this.m_health = Math.max(0, this.m_health - power);
      this.gameCommentaries("Player", "attack", power);
    },
    healPlayer() {
      let power = randomPower(5, 15);
      if (this.max_heal === 0) return;
      this.p_health = Math.min(this.max_p_health, this.p_health + power);
      this.gameCommentaries("Player", "heal", power);
      this.max_heal--;
    },
    surrenderGame() {
      this.result = "lose";
      this.gameCommentaries("Player", "surrender");
    },
    gameCommentaries(who, what, value = null) {
      let text = "";
      if (what === "heal") {
        text = who + " took First Aid and gain " + value + "% health!";
      } else if (what === "attack" && who === "Player") {
        text = who + " attacked on monster and damaged " + value + "% health!";
      } else if (what === "sp-attack") {
        text =
          who +
          " attacked on monster using special power and damaged " +
          value +
          "% health!";
      } else if (what === "attack") {
        text = who + " attacked on player and damaged " + value + "% health!";
      } else {
        text = who + " surrenderd to the Monster! :(";
      }
      this.commentaries.unshift(text);
    },
  },
});

app.mount("#game");
