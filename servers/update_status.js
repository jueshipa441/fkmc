function updateServerStatus() {
    // 修改 fetch 请求路径
    fetch('./server_status.json')
        .then(response => response.json())
        .then(data => {
            // 更新城市服务器状态
            const cityStatus = data.city_server;
            document.getElementById('city-players').textContent = `${cityStatus.players}/${cityStatus.max_players}`;
            document.getElementById('city-version').textContent = cityStatus.version;
            document.getElementById('city-status').textContent = cityStatus.online ? '在线' : '离线';
            document.getElementById('city-status').className = cityStatus.online ? 'status online' : 'status offline';
            
            // 更新服务器延迟信息
            if (cityStatus.online && cityStatus.latency) {
                document.getElementById('city-latency').textContent = `${cityStatus.latency.toFixed(0)} ms`;
            } else {
                document.getElementById('city-latency').textContent = '无法获取延迟';
            }
            
            // 尝试更新城市服务器玩家列表（如果元素存在）
            const cityPlayerList = document.getElementById('city-player-list');
            if (cityPlayerList) {
                cityPlayerList.innerHTML = '';
                if (cityStatus.online && cityStatus.player_list && cityStatus.player_list.length > 0) {
                    cityStatus.player_list.forEach(player => {
                        const li = document.createElement('li');
                        li.textContent = player;
                        cityPlayerList.appendChild(li);
                    });
                } else {
                    const li = document.createElement('li');
                    li.textContent = '暂无玩家在线';
                    cityPlayerList.appendChild(li);
                }
            }

            // 更新生存服务器状态
            const survivalStatus = data.survival_server;
            document.getElementById('survival-players').textContent = `${survivalStatus.players}/${survivalStatus.max_players}`;
            document.getElementById('survival-version').textContent = survivalStatus.version;
            document.getElementById('survival-status').textContent = survivalStatus.online ? '在线' : '离线';
            document.getElementById('survival-status').className = survivalStatus.online ? 'status online' : 'status offline';
            
            // 尝试更新生存服务器玩家列表（如果元素存在）
            const survivalPlayerList = document.getElementById('survival-player-list');
            if (survivalPlayerList) {
                survivalPlayerList.innerHTML = '';
                if (survivalStatus.online && survivalStatus.player_list && survivalStatus.player_list.length > 0) {
                    survivalStatus.player_list.forEach(player => {
                        const li = document.createElement('li');
                        li.textContent = player;
                        survivalPlayerList.appendChild(li);
                    });
                } else {
                    const li = document.createElement('li');
                    li.textContent = '暂无玩家在线';
                    survivalPlayerList.appendChild(li);
                }
            }
        })
        .catch(error => console.error('Error fetching server status:', error));
}

// 每60秒更新一次状态
setInterval(updateServerStatus, 60000);
// 页面加载时立即更新一次
updateServerStatus();