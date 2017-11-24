const listNumber = [6, 7, 8, 9];
const listResult = [11, 12, 13, 14];

const numberA = listNumber[parseInt(Math.random() * listNumber.length)];
const result = listResult[parseInt(Math.random() * listResult.length)];
const numberB = result - numberA;

const numA = document.getElementById('num_a');
const numB = document.getElementById('num_b');
const numR = document.getElementById('num_r');
const numRes = document.getElementById('num_res');

numA.innerHTML = numberA;
numB.innerHTML = numberB;
numR.innerHTML = '?';

const bodyWidth = document.body.clientWidth;

let axis = document.querySelector('.axis');
axis.style.width = Math.max(bodyWidth / 3, 400) + 'px';

let deltaWidth = getDeltaWidth(axis);

function getDeltaWidth(axis) {
    return (815 - 35) / 20 * parseInt(axis.style.width) / 875;
}

function Arrow(a, b, axisData) {
    this.axisData = axisData;
    this.elem = null;
    this.state = 1;

    this.update = update;
    this.create = create;
    onInput = onInput.bind(this);

    let elem = document.createElement('div');

    this.update();
    this.create();

    function update() {
        this.w = (b - a) * axisData.deltaWidth;
        this.h = this.w;
        this.x = this.axisData.x + 35 / 875 * this.axisData.width + a * this.axisData.deltaWidth;
        this.y = this.axisData.y - this.h + 19 / 83 * this.axisData.height;

        elem.className = 'arrow';
        elem.style.position = 'absolute';
        elem.style.height = this.h + 'px';
        elem.style.width = this.w + 'px';
        elem.style.top = this.y + 'px';
        elem.style.left = this.x + 'px';
    }

    function create() {
        let img = document.createElement('img');
        img.src = 'img/arrow.png';
        this.value = null;

        let aboveElem;
        if (this.state === 1) {
            aboveElem = createInput();
            aboveElem.addEventListener('input', onInput);
        } else {
            aboveElem = createText(this.value);
        }

        elem.appendChild(aboveElem);
        elem.appendChild(img);
        document.body.appendChild(elem);

        img.style.width = this.w + 'px';
        img.style.height = this.h / 2 / 2 + 'px';

        this.elem = elem;
    }

    function createInput() {
        const inputWidth = 20;
        const inputHeight = 20;
        let input = document.createElement('input');
        input.style.width = inputWidth + 'px';
        input.style.height = inputHeight + 'px';
        input.style.marginBottom = '5px';
        return input;
    }

    function createText(value) {
        let span = document.createElement('span');
        span.innerHTML = value;
        return span;
    }

    function onInput(evt) {
        const input = evt.target;
        const value = parseInt(input.value);

        if (!value) {
            input.classList.remove('mistake');
            this.axisData.currentNumberElem.classList.remove('mistake');
        } else if (value !== parseInt(this.axisData.currentNumberElem.innerHTML)) {
            input.classList.add('mistake');
            this.axisData.currentNumberElem.classList.add('mistake');
        } else {
            input.classList.remove('mistake');
            this.axisData.currentNumberElem.classList.remove('mistake');
            input.parentNode.removeChild(input);
            this.state = 2;
            this.value = value;
            aboveElem = createText(this.value);
            this.elem.insertBefore(aboveElem, this.elem.children[0]);
            this.axisData.state += 1;
            if (this.axisData.state === 2) {
                this.axisData.currentNumberElem = num_b;
                this.axisData.arrows.push(new Arrow(this.axisData.a, this.axisData.result, axisData));
            } else if (this.axisData.state === 3) {
                this.axisData.showResultInput();
            }
        }
    }
}

let axisData = {
    a: numberA,
    b: numberB,
    result: result,
    width: axis.clientWidth,
    height: axis.clientHeight,
    x: axis.offsetLeft,
    y: axis.offsetTop,
    deltaWidth: deltaWidth,
    state: 1,
    currentNumberElem: numA,
    arrows: [],
    showResultInput: function() {
        numR.hidden = true;
        numRes.hidden = false;
    }
};

numRes.addEventListener('input', function() {
    if (parseInt(this.value) !== result) {
        this.style.background = 'red';
    } else {
        this.style.background = '';
        numR.hidden = false;
        numRes.hidden = true;
        numR.innerHTML = result;
    }
});

axisData.arrows.push(new Arrow(0, numberA, axisData));

window.addEventListener('resize', function() {
    deltaWidth = getDeltaWidth(axis);
    console.log('resize');
    axisData.width = axis.clientWidth;
    axisData.height = axis.clientHeight;
    axisData.x = axis.offsetLeft;
    axisData.y = axis.offsetTop;
    axisData.deltaWidth = deltaWidth;
    axisData.arrows.forEach(arrow => {
        arrow.update();
    });
});