const jwtToken = window.localStorage.getItem('jwtToken');
console.log(jwtToken)

let result;
api.getLotteryResult(jwtToken)
    .then((json) => {
        console.log(json)
        if (json.error) {
            window.alert(json.error)
            window.location.assign("/profile.html")
        }
        if (json.msg) {
            result = json.msg;
            window.alert("開始抽獎！")
        }
    })



const myLucky = new LuckyCanvas.LuckyWheel('#root', {
    width: '300px',
    height: '300px',
    blocks: [{ padding: '10px', background: '#617df2' }],
    prizes: [
        { background: '#e9e8fe', fonts: [{ text: '免運券' }] },
        { background: '#b8c5f2', fonts: [{ text: '0.9折價券' }] },
        { background: '#e9e8fe', fonts: [{ text: '0.85折價券' }] },
        { background: '#b8c5f2', fonts: [{ text: '0.8折價券' }] },
        { background: '#e9e8fe', fonts: [{ text: '銘謝惠顧' }] },
        { background: '#b8c5f2', fonts: [{ text: ':)' }] },
    ],
    buttons: [{
        radius: '35%',
        background: '#8a9bf3',
        pointer: true,
        fonts: [{ text: 'Start', top: '-10px' }]
    }],
    start: function () {
        myLucky.play()
        setTimeout(() => {
            myLucky.stop(result)
            api.updateDiscount(result, jwtToken)
                .then((json) => { console.log(json) })
        }, 5000)

    },
    end: function (prize) {
        if (prize.fonts[0].text == '銘謝惠顧') {
            alert('Sorry! 你沒抽中ＱＱ，明天再來抽一次吧！加油！')
        } else {
            alert('恭喜！您獲得 ' + prize.fonts[0].text + ' 一張')
        }
        window.location.assign("/profile.html")
    }
});

console.log(myLucky)

