FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:jonathonf/ffmpeg-4 && \
    apt-get update && \
    apt-get install -y ffmpeg alsa-utils pulseaudio xvfb xdotool wget git

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt install -y ./google-chrome-stable_current_amd64.deb \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt-get install nodejs npm -yq

RUN echo "pcm.default pulse\nctl.default pulse" > .asoundrc

ADD entrypoint.sh entrypoint.sh
ADD remote remote

EXPOSE 9002/tcp

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
