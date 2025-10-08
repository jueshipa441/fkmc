#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件列表更新脚本
功能：扫描doc_list目录中的所有文件，生成files_config.json配置文件
使用方法：双击运行或通过命令行运行 python update_file_list.py
"""

import os
import json
import sys
from pathlib import Path


def get_file_size(file_path):
    """
    获取文件大小并格式化输出
    
    参数：
        file_path: 文件路径
    
    返回：
        str: 格式化后的文件大小字符串
    """
    try:
        # 获取文件大小（字节）
        size = os.path.getsize(file_path)
        
        # 格式化文件大小
        if size < 1024:
            return f"{size} B"
        elif size < 1024 * 1024 :
            return f"{size / 1024:.2f} KB"
        elif size < 1024 * 1024 * 1024:
            return f"{size / (1024 * 1024):.2f} MB"
        else:
            return f"{size / (1024 * 1024 * 1024):.2f} GB"
    except Exception:
        return "未知"


def get_file_creation_time(file_path):
    """
    获取文件的创建时间并格式化输出
    
    参数：
        file_path: 文件路径
    
    返回：
        str: 格式化后的文件创建时间字符串
    """
    try:
        # 获取文件的创建时间（Windows系统）
        creation_time = os.path.getctime(file_path)
        # 格式化时间
        import datetime
        formatted_time = datetime.datetime.fromtimestamp(creation_time).strftime('%Y-%m-%d %H:%M:%S')
        return formatted_time
    except Exception:
        return "未知"


def update_file_config():
    """
    更新文件配置列表
    扫描doc_list目录中的所有文件，并生成files_config.json文件
    """
    # 获取当前脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 设置doc_list目录路径
    doc_list_dir = os.path.join(script_dir, 'doc_list')
    
    # 设置配置文件路径
    config_file_path = os.path.join(script_dir, 'files_config.json')
    
    # 检查doc_list目录是否存在
    if not os.path.exists(doc_list_dir):
        print(f"错误：doc_list目录不存在 - {doc_list_dir}")
        # 如果目录不存在，创建它
        os.makedirs(doc_list_dir)
        print(f"已创建doc_list目录")
        
        # 创建空的配置文件
        config_data = {"files": []}
        with open(config_file_path, 'w', encoding='utf-8') as f:
            json.dump(config_data, f, ensure_ascii=False, indent=2)
        print(f"已创建空的配置文件 - {config_file_path}")
        return
    
    # 扫描doc_list目录中的所有文件
    files = []
    
    # 使用pathlib来处理文件路径，支持中文文件名
    for file_path in Path(doc_list_dir).iterdir():
        # 只处理文件，跳过目录
        if file_path.is_file():
            # 获取文件名
            file_name = file_path.name
            
            # 计算文件相对路径（相对于doc目录）
            relative_path = f"doc_list/{file_name}"
            
            # 获取文件大小
            file_size = get_file_size(str(file_path))
            
            # 获取文件创建时间
            creation_time = get_file_creation_time(str(file_path))
            
            # 添加到文件列表
            files.append({
                "name": file_name,
                "size": file_size,
                "path": relative_path,
                "time": creation_time
            })
    
    # 按文件名排序（可选）
    files.sort(key=lambda x: x["name"])
    
    # 生成配置数据
    config_data = {
        "files": files
    }
    
    # 写入配置文件
    try:
        with open(config_file_path, 'w', encoding='utf-8') as f:
            json.dump(config_data, f, ensure_ascii=False, indent=2)
        
        print(f"文件列表已更新成功！")
        print(f"共发现 {len(files)} 个文件")
        for file in files:
            print(f"- {file['name']} ({file['size']})")
        
    except Exception as e:
        print(f"错误：写入配置文件失败 - {e}")


def main():
    """
    主函数
    """
    print("正在更新文件列表...")
    update_file_config()
    
    # 如果是Windows系统，按任意键退出
    if sys.platform == 'win32':
        print("\n按任意键退出...")
        import msvcrt
        msvcrt.getch()


if __name__ == "__main__":
    main()