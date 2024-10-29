class SummaryObj {
  constructor(type, ro) {
    this.type = type;
    this.result = type === "s" ? ro.best : ro.average;
    this.person = ro.person;
    this.eventId = ro.eventId;
    this.link = ro.link;
    this.tag = type === "s" ? ro.sRT : ro.aRT;
    this.tagIndex =
      this.tag === "WR" ? 0 : this.tag === "CR" ? 1 : this.tag === "NR" ? 2 : 3;
    this.code = ro.person.wcaId + ro.eventId + type;
  }

  compare(other) {
    const tagDiff = this.tagIndex - other.tagIndex;
    return tagDiff === 0 ? this.result - other.result : tagDiff;
  }
}

module.exports = SummaryObj;
