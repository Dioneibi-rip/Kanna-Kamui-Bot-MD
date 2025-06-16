import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    let userId;
    if (m.quoted && m.quoted.sender) {
        userId = m.quoted.sender;
    } else {
        userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    }

    let user = global.db.data.users[userId];

    let name = await conn.getName(userId);
    let cumpleanos = user.birth || 'No especificado';
    let genero = user.genre || 'No especificado';
    let pareja = user.marry || 'Nadie';
    let description = user.description || 'Sin Descripción';
    let exp = user.exp || 0;
    let nivel = user.level || 0;
    let role = user.role || 'Sin Rango';
    let coins = user.coin || 0;
    let bankCoins = user.bank || 0;

    let avatar = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg');

    
    const backgroundURL = encodeURIComponent('https://i.ibb.co.com/2jMjYXK/IMG-20250103-WA0469.jpg');
    const avatarURL = encodeURIComponent(avatar);


    const imageAPI = `https://api.siputzx.my.id/api/canvas/profile?backgroundURL=${backgroundURL}&avatarURL=${avatarURL}&rankName=${encodeURIComponent(role)}&rankId=0&exp=${exp}&requireExp=0&level=${nivel}&name=${encodeURIComponent(name)}`;

    try {
        await conn.sendFile(m.chat, imageAPI, 'perfil.jpg', `
「✿」 *Perfil de @${userId.split('@')[0]}*
✦ Edad: ${user.age || 'Desconocida'}
♛ Cumpleaños: ${cumpleanos}
⚥ Género: ${genero}
♡ Casado con: ${pareja}

✎ Rango: ${role}
☆ Exp: ${exp.toLocaleString()}
❖ Nivel: ${nivel}

⛁ Coins Cartera: ${coins.toLocaleString()} ${moneda}
⛃ Coins Banco: ${bankCoins.toLocaleString()} ${moneda}
❁ Premium: ${user.premium ? '✅' : '❌'}

📝 Descripción: ${description}
`.trim(), m, false, { mentions: [userId] });
    } catch (e) {
        await conn.reply(m.chat, '❌ Error al generar el perfil.', m);
        console.error(e);
    }
};

handler.help = ['profile', 'perfil'];
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];

export default handler;
