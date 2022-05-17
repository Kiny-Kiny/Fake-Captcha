const request = require("request")
const urls = ["https://fakecaptcha.com/",
              "https://fakecaptcha.com/generate.php",
              "https://fakecaptcha.com/result.php"]

async function curl(opts) {
    return new Promise((resolve, reject) => { opts.rejectUnauthorized = false; request(opts, (err, res, body) => { resolve({ res, body }) }) })
}

async function spliter(msg, start, end) {
  let _msg = msg.split(start)[1]
  let msg_ = _msg.split(end)[0]
  return msg_
}

async function main(token, codigo) {
  try {
    let start = await curl({method: "GET", url: urls[0]})
    //-------------------------------------------------//
    let _words = await curl({method: "POST", url: urls[1], form: {words: codigo, force: 0, color: 'red'}})
    let words = await spliter(_words.body, '<input type="hidden" name="words" value="', '"')
    //-------------------------------------------------//
    let _foto = await curl({method: "POST", url: urls[2], form: {words: words}})
    let foto = await spliter(_foto.body, 'src="data:image/jpg;base64,', '"')
    //------------------------------------------------//
  } catch {
      return {status: 400, msg: "Error generating captcha!"}
    }
  return {status: 200, msg: foto}
}
