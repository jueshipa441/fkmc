from mcstatus import JavaServer
import json
import time
import socket
import os

#间隔时间，单位秒
n=60

def get_server_status(ip, port):
    try:
        print(f"\n正在尝试连接Java版服务器 {ip}:{port}")
        
        # 创建服务器对象
        server = JavaServer(ip, port)
        
        # 首先尝试ping服务器
        try:
            print("正在ping服务器...")
            latency = server.ping()
            print(f"服务器延迟: {latency}ms")
        except Exception as ping_error:
            print(f"Ping失败: {str(ping_error)}")
            return {
                "online": False,
                "players": 0,
                "max_players": 0,
                "version": "未知",
                "player_list": [],
                "error": f"Ping失败: {str(ping_error)}"
            }
        
        # 然后尝试获取基本状态
        try:
            print("正在获取服务器基本状态...")
            status = server.status()
            print(f"服务器版本: {status.version.name}")
            print(f"在线玩家: {status.players.online}/{status.players.max}")
            
            # 尝试获取玩家列表
            player_list = []
            try:
                print("正在尝试获取玩家列表...")
                query = server.query()
                if hasattr(query, 'players') and hasattr(query.players, 'names'):
                    player_list = query.players.names
                    print(f"成功获取玩家列表: {player_list}")
                else:
                    print("无法获取玩家列表信息")
            except Exception as query_error:
                print(f"查询玩家列表失败: {str(query_error)}")
            
            return {
                "online": True,
                "players": status.players.online,
                "max_players": status.players.max,
                "version": status.version.name,
                "player_list": player_list,
                "latency": latency
            }
            
        except Exception as status_error:
            print(f"获取服务器状态失败: {str(status_error)}")
            return {
                "online": False,
                "players": 0,
                "max_players": 0,
                "version": "未知",
                "player_list": [],
                "error": str(status_error)
            }
            
    except Exception as e:
        print(f"连接服务器 {ip}:{port} 失败: {str(e)}")
        print(f"错误类型: {type(e).__name__}")
        return {
            "online": False,
            "players": 0,
            "max_players": 0,
            "version": "未知",
            "player_list": [],
            "error": str(e)
        }

def update_status():
    # 定义您的服务器列表
    servers = [
        {"name": "city_server", "ip": "hbd.vanmc.cn", "port": 40003},
    ]
    
    print("\n开始检查服务器状态...")
    status_data = {}
    for server in servers:
        print(f"\n检查服务器: {server['name']}")
        status = get_server_status(server["ip"], server["port"])
        status_data[server["name"]] = status
    
    # 输出路径在当前目录
    output_path = os.path.join(os.path.dirname(__file__), "server_status.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(status_data, f, ensure_ascii=False, indent=2)
    print(f"服务器状态已保存到 {output_path}")

if __name__ == "__main__":
    while True:
        update_status()
        print(f"等{n}秒后再次检查...")
        time.sleep(n)

