<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router';
import router from '@/router';
import Sidebar from './Sidebar.vue';
import ChatRoom from './ChatRoom.vue';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const route = useRoute();
const usuario = route.query.usuario || 'Anonimo';
const estado = route.query.estado || '';
const avatar = route.query.avatar || '/avatars/avatar1.png';

const socket = io('http://localhost:3000');

const numeroUsuarios = ref(0);
const mensajes = ref([]);
const mensajeTexto = ref('');
const usuarioEscribiendo = ref('');
let escribiendoTimeout = null;

const chats = ref([
  {
    id: 'general',
    nombre: 'Chat común',
    tipo: 'comun',
    mensajes: [],
  },
  {
    id: 'juegos',
    nombre: 'Chat de juegos',
    tipo: 'privado',
    mensajes: [],
  },
  {
    id: 'debate',
    nombre: 'Chat de debate',
    tipo: 'grupo',
    mensajes: [],
  }
])

const chatActivoId = ref('general');

const chatActivo = computed(() => 
  chats.value.find((chat) => chat.id === chatActivoId.value))

onMounted(() => {
  socket.emit('nombreUsuario', {
    nombreUsuario: usuario,
  });

  socket.on('numeroUsuarios', (count) => {
    numeroUsuarios.value = count;
  });

  socket.on('mensaje', (mensaje) => {
    const chat = chats.value.find((chat) => chat.id === mensaje.chatId);

    if (chat) {
      chat.mensajes.push(mensaje);
    }
  });

  socket.on('nombreUsuario', (nombre) => {
    mensajes.value.push({
      tipo: 'sistema',
      texto: `${nombre} ha entrado en el canal`,
    });
  });

  socket.on('escribiendo', (nombre) => {
    usuarioEscribiendo.value = `${nombre} esta escribiendo...`;
    clearTimeout(escribiendoTimeout);

    escribiendoTimeout = setTimeout(() => {
      usuarioEscribiendo.value = '';
    }, 3000);
  });
});

onUnmounted(() => {
  socket.off('numeroUsuarios');
  socket.off('mensaje');
  socket.off('nombreUsuario');
  socket.off('escribiendo');
  clearTimeout(escribiendoTimeout);
  socket.disconnect();
});

function enviarMensaje() {
  const texto = mensajeTexto.value.trim();

  if (!texto || !chatActivo.value){
    return;
  }

  const mensaje = {
    chatId: chatActivo.value.id,
    usuario,
    avatar,
    texto,
    fecha: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  socket.emit('mensajeTexto', mensaje);
  mensajeTexto.value = '';
}

function avisarEscribiendo() {
  socket.emit('escribiendo', usuario);
}

async function cerrarSesion() {
  await signOut(auth);
  router.push('/');
}
</script>

<template>
  <main class="chat-shell">
    <Sidebar
      :usuario="usuario"
      :estado="estado"
      :avatar="avatar"
      :chats="chats"
      :chat-activo-id="chatActivoId"
      @seleccionar-chat="chatActivoId = $event"
    />

    <ChatRoom
      v-model:mensaje-texto="mensajeTexto"
      :chat-activo="chatActivo"
      :usuario="usuario"
      :numero-usuarios="numeroUsuarios"
      :usuario-escribiendo="usuarioEscribiendo"
      @enviar-mensaje="enviarMensaje"
      @escribiendo="avisarEscribiendo"
      @cerrar-sesion="cerrarSesion"
    />
  </main>
</template>

<style scoped>
.chat-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  background:
    radial-gradient(circle at top left, rgba(37, 211, 102, 0.18), transparent 34%),
    linear-gradient(135deg, #f5faf7 0%, #dff2e7 50%, #f7f7f4 100%);
  color: #17352a;
}

@media (max-width: 680px) {
  .chat-shell {
    grid-template-columns: 1fr;
  }
}
</style>
