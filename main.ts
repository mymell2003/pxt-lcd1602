/**
* LCD1602顯示器的函數
*/

//% weight=0 color=#bada55 icon="\uf108" block="LCD1602"
namespace lcd1602 {
    export let LCD_I2C_ADDR = 0x3f
    let buf = 0x00
    let BK = 0x08
    let RS = 0x00
    let E = 0x04

    function setReg(dat: number): void {
        pins.i2cWriteNumber(LCD_I2C_ADDR, dat, NumberFormat.UInt8BE, false)
        basic.pause(1)
    }

    function send(dat: number): void {
        let d = dat & 0xF0
        d |= BK
        d |= RS
        setReg(d)
        setReg(d | 0x04)
        setReg(d)
    }

    function setcmd(cmd: number): void {
        RS = 0
        send(cmd)
        send(cmd << 4)
    }

    function setdat(dat: number): void {
        RS = 1
        send(dat)
        send(dat << 4)
    }

    export enum I2C_ADDR {
        //% block="0x27"
        addr1 = 0x27,
        //% block="0x3f"
        addr2 = 0x3f
    }
    export enum on_off {
        //% block="on"
        on = 1,
        //% block="off"
        off = 0
    }

    export enum visibled {
        //% block="visibled"
        visible = 1,
        //% block="invisibled"
        invisible = 0
    }

    //% blockId="LCD_setAddress" block="LCD1602 I2C address %myAddr"
    //% weight=0 blockExternalInputs=true
    export function setAddress(myAddr: I2C_ADDR): void {
        LCD_I2C_ADDR = myAddr
        setcmd(0x33)
        basic.pause(5)
        send(0x30)
        basic.pause(5)
        send(0x20)
        basic.pause(5)
        setcmd(0x28)
        setcmd(0x0C)
        setcmd(0x06)
        setcmd(0x01)
    }

    //% blockId="LCD_clear" block="LCD clear"
    //% weight=1
    export function clear(): void {
        setcmd(0x01)
    }

    //% blockId="LCD_backlight" block="set LCD backlight %on"
    //% weight=2
    export function set_backlight(on: on_off): void {
        if (on == 1)
            BK = 0x08
        else
            BK = 0x00
        setcmd(0x00)
    }

    //% blockId="LCD_Show" block="set string %show"
    //% weight=3
    export function set_LCD_Show(show: visibled): void {
        if (show == 1)
            setcmd(0x0C)
        else
            setcmd(0x08)
    }

    function printChar(ch: number, x: number, y: number): void {
        if (x >= 0) {
            let a = 0x80
            if (y > 0)
                a = 0xC0
            a += x
            setcmd(a)
        }
        setdat(ch)
    }

    //% blockId="LCD_putString" block="LCD show string %s|on x:%x|y:%y"
    //% weight=4 blockExternalInputs=true x.min=0 x.max=15 y.min=0 y.max=1
    export function puts(s: string, x: number, y: number): void {
        if (s.length > 0) {
            let breakPoint = -1
            printChar(s.charCodeAt(0), x, y)
            if (y == 0)
                breakPoint = 16 - x
            for (let i = 1; i < s.length; i++) {
                if (i == breakPoint)
                    printChar(s.charCodeAt(i), 0, 1)
                else
                    printChar(s.charCodeAt(i), -1, 0)
            }
        }
    }

} 
