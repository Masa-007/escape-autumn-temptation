FROM nginx:alpine

# 作業ディレクトリを設定
WORKDIR /usr/share/nginx/html

# HTML, CSS をコピー
COPY index.html .
COPY game.html .
COPY style.css .
COPY clear.html .


# JS フォルダごとコピー
COPY js/ ./js/

# 画像ファイルもコピー
COPY assets/images/ ./assets/images/

# BGMファイルもコピー
COPY assets/audio/ ./assets/audio/

# ポート80を公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]