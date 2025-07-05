import yts from "yt-search";
import fetch from "node-fetch";

const SIZE_LIMIT_MB = 100;
const newsletterJid = '120363402780749345@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡『 Kanna-Kamui-Channel 』࿐⟡';

const handler = async (m, { conn, text, command }) => {
  const name = conn.getName(m.sender);
  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid,
      newsletterName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: packname,
      body: "🎧 Kanna Kamui Downloader",
      thumbnail: icons,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  if (!text) {
    return conn.reply(m.chat,
      `🌸 *Konnichiwa ${name}-chan~!* Necesito que me digas el nombre de un video o me pegues el link de YouTube 💕\n\n✨ *Ejemplos:*\n.play Shinzou wo Sasageyo\n.play https://youtu.be/xxx`,
      m, { contextInfo });
  }

  await m.react("🕝");

  const search = await yts(text);
  if (!search?.all || search.all.length === 0) {
    return conn.reply(m.chat, `💦 *Gomen ne, no encontré nada con:* "${text}"`, m, { contextInfo });
  }

  const video = search.all[0];

  const caption = `
╭─ꨪᰰ━۪  ࣪  ꨶ ╼ׄ ╼࡙֟፝͝⌒࣪᷼⏜ׅ ࣪🍵᮫໋⃨𝆬 ࣪ ׅ⏜ׄ᷼⌒╼࡙֟፝͝ ╾ 
 𝆡𑘴⃞ֵ݄݁ׄ🫖ׄׄ ⃨֟፝★̫᤺.݁ׄ⋆⃨݁ 𝐏𝕝𝕒𝕪 𝕗𝕠𝕣 𝕪𝕠𝕦, 𝐨𝕟𝕚𝕚-𝕔𝕙𝕒𝕟~🌸
     ╰─ꨪᰰ━۪  ࣪  ꨶ ╼ׄ ╼࡙֟፝͝⌒࣪᷼⏜ׅ ࣪🍵᮫໋⃨𝆬 ࣪ ׅ⏜ׄ᷼⌒╼࡙֟፝͝ ╾  
╭─ꨪᰰ━۪  ࣪ ꨶ ╼ׄ ╼࡙֟፝͝⌒࣪᷼⏜ׅ 🍵᮫໋⃨𝆬 ࣪ ⏜ׄ᷼⌒╼࡙֟፝͝ ╾ 
> 𑁯᧙  🍓 *Título:* ${video.title}
> 𑁯᧙  📏 *Duración:* ${video.duration.timestamp}
> 𑁯᧙  👁️ *Vistas:*  ${video.views.toLocaleString()}
> 𑁯᧙  🎨 *Autor:* ${video.author.name}
> 𑁯᧙  📝 *Vídeo url:* ${video.url}
╰─ꨪᰰ━۪  ࣪ ꨶ ╼ׄ ╼࡙֟፝͝⌒࣪᷼⏜ׅ 🍵᮫໋⃨𝆬 ࣪ ⏜ׄ᷼⌒╼࡙֟፝͝ ╾
💌 Arigatou por usarme, siempre estaré aquí para ti~ ✨`.trim();

  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption,
    contextInfo
  }, { quoted: m });

  try {
    if (command === "play") {
      const resAudio = await fetch(`https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(video.title)}`);
      const json = await resAudio.json();

      if (!json.status || !json.result?.download?.url) {
        const cause = json.message || "No se pudo descargar el audio.";
        return conn.reply(m.chat, `❌ Error de audio:\n📛 *Causa:* ${cause}`, m, { contextInfo });
      }

      await conn.sendMessage(m.chat, {
        audio: { url: json.result.download.url },
        mimetype: "audio/mpeg",
        fileName: json.result.download.filename || `${video.title}.mp3`,
        ptt: false
      }, { quoted: m });

      await m.react("🎶");

    } else if (command === "play2" || command === "playvid") {
      const apiBase = "https://api.stellarwa.xyz/dow";
      const resVideo = await fetch(`${apiBase}/ytmp4?url=${encodeURIComponent(video.url)}`);
      const json = await resVideo.json();

      if (!json.status || !json.data?.dl) {
        const cause = json.message || "No se pudo descargar el video.";
        return conn.reply(m.chat, `❌ Error de video:\n📛 *Causa:* ${cause}`, m, { contextInfo });
      }

      const head = await fetch(json.data.dl, { method: "HEAD" });
      const sizeMB = parseInt(head.headers.get("content-length") || "0") / (1024 * 1024);
      const asDocument = sizeMB > SIZE_LIMIT_MB;

      await conn.sendMessage(m.chat, {
        video: { url: json.data.dl },
        caption: `🎥 *Listo ${name}-chan!* Aquí está tu video~`,
        fileName: json.data.title + ".mp4",
        mimetype: "video/mp4"
      }, {
        quoted: m,
        ...(asDocument ? { asDocument: true } : {})
      });

      await m.react("📽️");
    }
  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, `❌ Error inesperado:\n\`\`\`${e.message}\`\`\``, m, { contextInfo });
  }
};

handler.help = ["play", "play2", "playvid"];
handler.tags = ["descargas"];
handler.command = ["play", "play2", "playvid"];
handler.register = true;
handler.limit = true;

export default handler;
