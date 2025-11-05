// npx eslint test/index.js
// 经过以上命令报错下面说明

// 测试var声明（应报错）
var testVar = 'should error';

// 测试函数复杂度（超过15，应警告）
function complexFunction(a) {
  if (a > 0) {
    if (a > 10) {
      if (a > 20) {
        if (a > 30) {
          if (a > 40) {
            if (a > 50) {
              if (a > 60) {
                if (a > 70) {
                  if (a > 80) {
                    if (a > 90) {
                      return 'big';
                    } else return '80-90';
                  } else return '70-80';
                } else return '60-70';
              } else return '50-60';
            } else return '40-50';
          } else return '30-40';
        } else return '20-30';
      } else return '10-20';
    } else return '0-10';
  } else return 'negative';
}

// 测试双引号（应报错）
const str = "should use single quote";

// 测试无分号（应报错）
const num = 123