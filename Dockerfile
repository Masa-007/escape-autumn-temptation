# Dockerfile
FROM nginx:alpine

# 作業ディレクトリを設定
WORKDIR /usr/share/nginx/html

# ゲームファイルをコンテナにコピー
COPY index.html .
COPY style.css .
COPY script.js .

# ポート80を公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]