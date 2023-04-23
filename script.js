
var can = document.querySelector("canvas");
var ctx = can.getContext("2d");
var SIZE;
var board;
var tileSize;
var turn = false;
var count = 100;
var offx = 0; 
var offy = 0;
var anSpeed = 10;

can.width = (window.innerWidth * 0.8, window.innerHeight * 0.8);
can.height = can.width;
can.addEventListener("click", input);

init(window.prompt("Grid Size:", "4"));

function init(num)
{
    SIZE = num;
    tileSize = Math.min(can.width, can.height) / SIZE;
    board = "";
    board = [];
    for (var x = 0; x < SIZE; x++)
    {
        board.push([]);
        for (var y = 0; y < SIZE; y++)
            board[x].push(0);
    }
    display(0, 0);
}


function input(event)
{
    if (count == 100)
    {
        var x = Math.floor((event.clientX - can.getBoundingClientRect().left) / tileSize);
        var y = Math.floor((event.clientY - can.getBoundingClientRect().top) / tileSize);
    
        if (board[x][y] == 0)
        {
            board[x][y] = turn + 1;
            turn = !turn;
            count = 0;
            display(offx + 0.0001, offy + 0.0001);
            setTimeout(function ()
            {
                shift();

                var int = setInterval(function () 
                {
                    display(offx - offx * count / tileSize, offy - offy * count / tileSize);
                    count += anSpeed;
                    if (count >= tileSize)
                    {
                        offx = 0;
                        offy = 0;
                        count = 100;
                        display(0, 0);
                        clearInterval(int);
                    }
                }, 100 / anSpeed);
            }, 500);
        }
    }
}


function shift()
{
    var dir = Math.floor(Math.random() * 4);
    var ox = (dir % 2) * (dir >= 2 ? -1 : 1);
    var oy = ((dir + 1) % 2) * (dir >= 2 ? -1 : 1);
    offx = ox;
    offy = oy;
    var tmp = [];
    for (var x = 0; x < SIZE; x++)
    {
        tmp.push([]);
        for (var y = 0; y < SIZE; y++)
            tmp[x].push(board[x][y]);
    }

    for (var x = 0; x < SIZE; x++)
        for (var y = 0; y < SIZE; y++)
            set(x, y, 0);

    for (var x = 0; x < SIZE; x++)
        for (var y = 0; y < SIZE; y++)
        {
            set(x + ox, y + oy, tmp[x][y]);
        }
}


function set(x, y, value)
{
    if (x >= 0 && y >= 0 && x < SIZE && y < SIZE)
        board[x][y] = value;
}


function display(ox, oy)
{
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.fillStyle = "#888";
    if (ox == 0 && oy == 0)
        ctx.strokeStyle = (turn ? "#f88" : "#88f");
    else
        ctx.strokeStyle = "#666";
    ctx.lineWidth = 2;
    for (var x = 0; x < SIZE; x++)
        for (var y = 0; y < SIZE; y++)
        {
            var posx = can.width / 2 - SIZE * tileSize / 2 + x * tileSize;
            var posy = can.height / 2 - SIZE * tileSize / 2 + y * tileSize;
            ctx.fillRect(posx, posy, tileSize, tileSize);
            ctx.strokeRect(posx, posy, tileSize, tileSize);
        }
    ctx.lineWidth = 10;
    for (var x = 0; x < SIZE; x++)
        for (var y = 0; y < SIZE; y++)
        {
            var posx = can.width / 2 - SIZE * tileSize / 2 + x * tileSize - ox * tileSize;
            var posy = can.height / 2 - SIZE * tileSize / 2 + y * tileSize - oy * tileSize;
            if (board[x][y] == 1)
            {
                ctx.strokeStyle = "#88f";
                ctx.beginPath();
                ctx.moveTo(posx + tileSize / 8, posy + tileSize / 8);
                ctx.lineTo(posx + tileSize - tileSize / 8, posy + tileSize - tileSize / 8);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(posx + tileSize - tileSize / 8, posy + tileSize / 8);
                ctx.lineTo(posx + tileSize / 8, posy + tileSize - tileSize / 8);
                ctx.closePath();
                ctx.stroke();
            }
            else if (board[x][y] == 2)
            {
                ctx.strokeStyle = "#f88";
                ctx.beginPath();
                ctx.arc(posx + tileSize / 2, posy + tileSize / 2, tileSize * 0.4, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.stroke();
            }
            else if (board[x][y] == 3)
            {
                ctx.fillStyle = "#444";
                ctx.beginPath();
                ctx.arc(posx + tileSize / 2, posy + tileSize / 2, tileSize * 0.4, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        }
}
