const SP = 0b00000111;
class CPU {
    constructor(ram) {
        this.ram = ram;
        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        this.reg[SP] = 0xf4;
        this.reg.PC = 0; // Program Counter
    }

    poke(address, value) {
        this.ram.write(address, value);
    }

    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    stopClock() {
        clearInterval(this.clock);
    }

    error() {
        console.log('ERROR! Improper argument length');
        this.stopClock();
    }

    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                this.reg[regA] *= this.reg[regB];
                break;
            case 'ADD':
                this.reg[regA] += this.reg[regB];
                break;
            default:
                console.log('There was an error in the ALU...command not found');
                break;
        }
    }

    tick() {
        const IR = this.reg.PC;
        const LDI = 0b10011001;
        const MUL = 0b10101010;
        const ADD = 0b10101000;
        const PRN = 0b01000011;
        const HLT = 0b00000001;
        const PUSH = 0b01001101;
        const POP = 0b01001100;
        const CALL = 0b01001000;
        const RET = 0b00001001;
        const TEST = 0b00011000;

        let operandA = this.ram.read(IR + 1);
        let operandB = this.ram.read(IR + 2);

        let proceed = true;

        switch (this.ram.read(IR)) {
            case HLT:
                this.stopClock();
                break;
            case PRN:
                console.log(this.reg[operandA]);
                break;
            case LDI:
                this.reg[operandA] = operandB;
                break;
            case MUL:
                this.alu('MUL', operandA, operandB);
                break;
            case ADD:
                this.alu('ADD', operandA, operandB);
                break;
            case PUSH:
                this.reg[SP] -= 1;
                this.ram.write(this.reg[SP], this.reg[operandA]);
                break;
            case POP:
                this.reg[operandA] = this.ram.read(this.reg[SP]);
                this.reg[SP] += 1;
                break;
            case CALL:
                proceed = false;                            
                break;
            case RET:
                proceed = true;
                break;
            case TEST:
                console.log('testing');
                break;
            default:
                console.log(`Error at position: ${IR}, code: ${this.ram.read(IR)}`);
                this.stopClock();
        }

        if (proceed) {
            this.reg.PC += 1;
            const num = this.ram.read(IR) >>> 6;
            this.reg.PC += num;
        }
    }
}

module.exports = CPU;
