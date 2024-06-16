class Worker {
  constructor(workerId) {
    this.workerId = parseInt(workerId, 10);
    this.sequence = 0;
    this.lastTimestamp = -1;
  }

  types = {
    0b0000: "user",
    0b0001: "channel",
    0b0010: "guild",
    0b0011: "role",
    0b0100: "message",
  };

  nextId(dataTypeReadable) {
    let timestamp = this.genTimestamp();
    if (timestamp < this.lastTimestamp) {
      throw new Error("Clock moved backwards. Refusing to generate id");
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & 0x3ff;
      if (this.sequence === 0) {
        while (timestamp <= this.lastTimestamp) {
          timestamp = this.genTimestamp();
        }
      }
    } else {
      this.sequence = 0;
    }

    const dataType = parseInt(
      Object.keys(this.types).find(
        (key) => this.types[key] === dataTypeReadable
      ),
      10
    );

    if (isNaN(dataType)) {
      throw new Error(`Invalid data type: ${dataTypeReadable}`);
    }

    this.lastTimestamp = timestamp;

    // return decimal
    return (
      (BigInt(timestamp) << 22n) |
      (BigInt(this.workerId) << 14n) |
      (BigInt(this.sequence) << 4n) |
      BigInt(dataType)
    );
  }

  genTimestamp() {
    return Date.now() - 1577808000000;
  }

  parseId(id) {
    const dataType = Number(id & 0xfn);
    const sequence = Number((id >> 4n) & 0x3ffn);
    const workerId = Number((id >> 14n) & 0xffn);
    const timestamp = Number((id >> 22n) & 0x3ffffffffffn);

    const dataTypeReadable = this.types[dataType];

    return { dataType, sequence, workerId, timestamp, dataTypeReadable };
  }

  random = Math.floor(Math.random() * 16);
}

const worker = new Worker(process.env.WORKER_ID || 0b000);

//RUN INTERNAL TESTS
const test = () => {
  const types = worker.types;

  Object.keys(types).forEach((type) => {
    const id = worker.nextId(types[type]);
    const parsedId = worker.parseId(id);

    if (parsedId.dataTypeReadable !== types[type]) {
      console.error(`Failed to parse id: ${id}`);

      throw new Error("Internal test failed for snowflake");
    }
  });

  console.log("Internal test 1 passed for snowflake");

  const uniqueIds = new Set();

  for (let i = 0; i < 1000000; i++) {
    const id = worker.nextId("user");

    if (uniqueIds.has(id)) {
      console.error(`Duplicate id: ${id}`);

      throw new Error("Internal test failed for snowflake");
    }

    uniqueIds.add(id);
  }

  console.log("Internal test 2 passed for snowflake");

  console.log("-------------------");
  console.log("Snowflake utility is working correctly");
  console.log("wokerId: ", worker.workerId);
  console.log("-------------------");
};

test();

module.exports = worker;
