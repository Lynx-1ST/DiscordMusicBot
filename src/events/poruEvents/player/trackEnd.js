module.exports.run = async (client, player) => {
    if (!player) return;

    if (player.message) await player.message.delete();

    if (!player.currentTrack) return;

    if (player.autoplay === true) {
        try {
            const trackSearch = player.currentTrack.info;

            const ytUri = /^(https?:\/\/)?(www\.)?(m\.)?(music\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(trackSearch.uri);

            if (ytUri) {
                const source = client.config.playSource;
                const identifier = trackSearch.identifier;
                const search = `https://music.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
                const res = await client.poru.resolve(search, source);

                if (res.tracks && res.tracks.length > 0) {
                    for (const track of res.tracks) {
                        track.info.requester = trackSearch.requester;
                    }

                    const randomTrack = res.tracks[Math.floor(Math.random() * res.tracks.length)];
                    await player.queue.add(randomTrack);
                }
            }
        } catch (error) {
            console.error('Lỗi khi tự động phát:', error);
            
            // Thông báo lỗi cho người dùng
            const errorMessage = 'Đã xảy ra lỗi khi tự động phát bài hát tiếp theo. Vui lòng thử lại sau.';
            
            if (player.textChannel) {
                try {
                    await player.textChannel.send(errorMessage);
                } catch (sendError) {
                    console.error('Không thể gửi thông báo lỗi:', sendError);
                }
            }
            
            // Có thể thêm xử lý lỗi bổ sung ở đây nếu cần
        }
    }
};