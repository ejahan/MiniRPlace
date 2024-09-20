const socket = io('http://localhost:3004');

socket.on('connect', () => {
    socket.emit('connected', 'Connected');
});

socket.on('color_changed', (data) => {
    console.log(data);
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
        });
});


document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const colorPicker = document.getElementById('color-picker');
  const rows = 20;
  const cols = 20;

  canvas.tabIndex = 0;
  for (let i = 0; i < rows; i++) {
      const row = document.createElement('tr');
      row.tabIndex = 0;
      for (let j = 0; j < cols; j++) {
          const cell = document.createElement('td');
          cell.tabIndex = 0;

          const change_color = () => {
            const color = colorPicker.value;
            cell.style.backgroundColor = color;
            cell.style.animation = 'rotating 1s';

            fetch('http://localhost:3003/update-color', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ row: i, col: j, color })
            })
                .then(() => {
                    socket.emit('message', 'A color has been changed');
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
      });
});
