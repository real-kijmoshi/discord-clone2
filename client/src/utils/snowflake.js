
// 42 bits for time, 8 bits for worker id, 10 bits for sequence, 4 bits for data typeconst parse = (snowflake) => {

const types = {
    0b0000: "user",
    0b0001: "channel",
    0b0010: "guild",
    0b0011: "role",
    0b0100: "message",
    0b0101: "media",
    
};

const parse = (snowflake) => {
    const binary = BigInt(snowflake).toString(2).padStart(64, "0");
    const timestamp = parseInt(binary.substring(0, 42), 2) + 1577808000000;
    const workerId = parseInt(binary.substring(42, 50), 2);
    const sequence = parseInt(binary.substring(50, 60), 2);
    const dataType = parseInt(binary.substring(60, 64), 2);
    return {
        timestamp,
        workerId,
        sequence,
        dataType: types[dataType],
    };
}