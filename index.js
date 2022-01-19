let base64index = [
    "A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g",
    "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "+", "/"
]

let base64reverse = {}
for (let index in base64index)
    base64reverse[base64index[index]] = Number(index)

function fix(str, bits = 8)
{
    let need_gap = bits - str.length
    for (let i = 0; i < need_gap; i++)
        str = `0${str}`

    return str
}

//字符串转base64，目前不支持中文的
function toBase64(str)
{
    let num = 0
    let concat = ""
    let base64 = ""
    for (let i of str)
    {
        let acs2 = fix(i.charCodeAt().toString(2))
        concat += acs2

        ++num
        if (num == 3)
        {
            //组装
            let str1 = `00${concat.substring(0, 6)}`
            let str2 = `00${concat.substring(6, 12)}`
            let str3 = `00${concat.substring(12, 18)}`
            let str4 = `00${concat.substring(18)}`

            base64 = base64 + base64index[parseInt(str1, 2)]
            base64 = base64 + base64index[parseInt(str2, 2)]
            base64 = base64 + base64index[parseInt(str3, 2)]
            base64 = base64 + base64index[parseInt(str4, 2)]

            concat = ""
            num = 0
        }
    }

    if (num == 2)
    {
        //组装
        let str1 = `00${concat.substring(0, 6)}`
        let str2 = `00${concat.substring(6, 12)}`
        let str3 = `00${concat.substring(12)}00`

        base64 = base64 + base64index[parseInt(str1, 2)]
        base64 = base64 + base64index[parseInt(str2, 2)]
        base64 = base64 + base64index[parseInt(str3, 2)]

        base64 += "="
    }

    if (num == 1)
    {
        //组装
        let str1 = `00${concat.substring(0, 6)}`
        let str2 = `00${concat.substring(6)}0000`

        base64 = base64 + base64index[parseInt(str1, 2)]
        base64 = base64 + base64index[parseInt(str2, 2)]
        base64 += "=="
    }

    return base64
}

//base64还原为字符串
function fromBase64(str)
{
    let origin_str = ""
    let num = 0
    let concat = ""
    for (let i of str)
    {
        if (i == "=")
            break

        let index = base64reverse[i]
        //无法识别的字符不管
        if (!index)
            continue
        index = fix(index.toString(2), 6)

        concat += index
        ++num
        if (num == 4)
        {
            let str1 = parseInt(concat.substring(0, 8), 2)
            let str2 = parseInt(concat.substring(8, 16), 2)
            let str3 = parseInt(concat.substring(16), 2)

            origin_str += String.fromCharCode(str1, str2, str3)

            num = 0
            concat = ""
        }
    }

    if (num == 3)
    {
        let str1 = parseInt(concat.substring(0, 8), 2)
        let str2 = parseInt(concat.substring(8, 16), 2)

        origin_str += String.fromCharCode(str1, str2)
    }

    if (num == 2)
    {
        let str1 = parseInt(concat.substring(0, 8), 2)
        origin_str += String.fromCharCode(str1)
    }

    return origin_str
}

function main()
{
    let text = "dfgsdf@#$!!!!555\nsdfds fdf1 1"
    let base64 = toBase64(text)

    console.log(text)
    console.log(base64)

    let decode = fromBase64(base64)
    console.log(decode)
}

main()
