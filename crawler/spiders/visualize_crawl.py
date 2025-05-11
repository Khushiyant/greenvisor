import json
import networkx as nx
import matplotlib.pyplot as plt
import time
import os

def load_graph(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def build_nx_graph(crawl_graph):
    G = nx.DiGraph()
    for url, info in crawl_graph.items():
        G.add_node(url)
        for child in info.get("children", []):
            G.add_edge(url, child)
    return G

def visualize_graph(G):
    plt.figure(figsize=(16, 10))
    pos = nx.spring_layout(G, k=0.15, iterations=20)
    nx.draw(G, pos, with_labels=False, node_size=30, edge_color='gray', alpha=0.7)
    plt.title("Crawl Graph Visualization")
    plt.show()

def live_visualize(json_path, interval=5):
    import matplotlib.pyplot as plt
    plt.ion()
    fig = plt.figure(figsize=(16, 10))
    # Wait for the file to exist
    while not os.path.exists(json_path):
        print(f"Waiting for {json_path} to be created by the crawler...")
        time.sleep(2)
    while True:
        plt.clf()
        crawl_graph = load_graph(json_path)
        G = build_nx_graph(crawl_graph)
        pos = nx.spring_layout(G, k=0.15, iterations=20)
        nx.draw(G, pos, with_labels=False, node_size=30, edge_color='gray', alpha=0.7)
        plt.title(f"Crawl Graph Visualization ({G.number_of_nodes()} nodes)")
        plt.pause(0.01)
        time.sleep(interval)

if __name__ == '__main__':
    import sys
    if '--live' in sys.argv:
        live_visualize('crawl_graph.json', interval=5)
    else:
        crawl_graph = load_graph('crawl_graph.json')
        G = build_nx_graph(crawl_graph)
        print(f"Graph loaded: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges.")
        visualize_graph(G)
