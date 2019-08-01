FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:jonathonf/ffmpeg-4 && \
    apt-get update && \
    apt-get install -y ffmpeg chromium-browser alsa-utils pulseaudio xvfb xdotool

RUN echo "pcm.default pulse\nctl.default pulse" > .asoundrc

ADD entrypoint.sh entrypoint.sh

EXPOSE 9002:9002

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
