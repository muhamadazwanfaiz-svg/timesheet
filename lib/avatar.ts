export function getFunAvatar(id: string) {
    const emojis = ["🦊", "🐼", "🦄", "🦁", "🐧", "🐸", "🐙", "🍄", "🚀", "🎨", "🎸", "⚡️", "🥑", "🍩", "🤖", "👻", "🐱", "🐶", "🦋", "🦖"];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % emojis.length;
    return emojis[index];
}
