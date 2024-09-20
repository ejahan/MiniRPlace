const ROWS = 20;
const COLS = 20;

const socket = io('http://localhost:3004');
let ip;

socket.on('connect', () => {
    socket.emit('connected', 'Connected');
});

fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        ip = data.ip;
    })
    .catch(error => {
        console.log('Error:', error);
});

const color_changed = () => {
    fetch('http://localhost:3003/canvas')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    const cell = canvas.querySelector(`tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
                    if (cell) {
                        cell.style.backgroundColor = data[i][j];
                    }
                }
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
}


socket.on('color_changed', (data) => {
    console.log(data);
    color_changed();
});


document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const colorPicker = document.getElementById('color-picker');

  canvas.tabIndex = 0;
  for (let i = 0; i < ROWS; i++) {
      const row = document.createElement('tr');
      row.tabIndex = 0;
      for (let j = 0; j < COLS; j++) {
          const cell = document.createElement('td');
          cell.tabIndex = 0;

          const change_color = () => {
            const color = colorPicker.value;
            const time = Date.now();

            fetch('http://localhost:3003/update-color', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ ip, row: i, col: j, color, time })
            })
                .then(response => response.json())
                .then(res => {
                    if (res.success) {
                        cell.style.backgroundColor = color;
                        cell.style.animation = 'rotating 1s';
                        socket.emit('message', 'A color has been changed');
                    }
                })
                .catch(error => {
                    console.log('Error:', error);
                });
          }

          cell.addEventListener("keydown", (e) => {
            if (e.key === 'Enter')
              change_color();
          });
          cell.addEventListener('click', change_color);

          row.appendChild(cell);
      }
      canvas.appendChild(row);
  }

  color_changed()
});
