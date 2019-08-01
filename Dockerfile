FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:jonathonf/ffmpeg-4 && \
    apt-get update && \
    apt-get install -y ffmpeg alsa-utils pulseaudio xvfb xdotool

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt install -y ./google-chrome-stable_current_amd64.deb

RUN echo "pcm.default pulse\nctl.default pulse" > .asoundrc

ADD entrypoint.sh entrypoint.sh

EXPOSE 9002:9002

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
