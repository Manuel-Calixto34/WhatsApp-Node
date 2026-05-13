<script setup>
defineProps({
  chatActivo: {
    type: Object,
    default: null,
  },
  usuario: {
    type: String,
    required: true,
  },
  numeroUsuarios: {
    type: Number,
    required: true,
  },
  usuarioEscribiendo: {
    type: String,
    default: '',
  },
  mensajeTexto: {
    type: String,
    required: true,
  },
});

defineEmits([
  'cerrar-sesion',
  'enviar-mensaje',
  'escribiendo',
  'update:mensajeTexto',
]);
</script>

<template>
  <section class="chat-layout">
    <header class="chat-header">
      <div class="chat-title">
        <span class="brand-icon">W</span>
        <div>
          <h1>WhatsAppNode</h1>
          <p>{{ chatActivo?.nombre || 'Chat comun' }}</p>
          <p v-if="usuarioEscribiendo" class="typing-message">
            {{ usuarioEscribiendo }}
          </p>
        </div>
      </div>

      <div class="chat-status">
        <span>{{ numeroUsuarios }} conectados</span>
        <button type="button" class="logout-button" @click="$emit('cerrar-sesion')">
          Cerrar sesion
        </button>
      </div>
    </header>

    <main class="chat-messages">
      <div
        v-for="(mensaje, index) in chatActivo?.mensajes || []"
        :key="index"
        class="message-row"
        :class="{
          own: mensaje.usuario === usuario,
          system: mensaje.tipo === 'sistema'
        }"
      >
        <div v-if="mensaje.tipo === 'sistema'" class="system-message">
          {{ mensaje.texto }}
        </div>

        <article v-else class="message-bubble">
          <div class="message-user">
            <img :src="mensaje.avatar" alt="Avatar" />
            <strong>{{ mensaje.usuario }}</strong>
          </div>

          <p>{{ mensaje.texto }}</p>
          <span>{{ mensaje.fecha }}</span>
        </article>
      </div>
    </main>

    <form class="chat-form" @submit.prevent="$emit('enviar-mensaje')">
      <input
        :value="mensajeTexto"
        placeholder="Escribe un mensaje"
        @input="$emit('update:mensajeTexto', $event.target.value); $emit('escribiendo')"
      />
      <button type="submit">Enviar</button>
    </form>
  </section>
</template>

<style scoped>
.chat-layout {
  min-width: 0;
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px clamp(18px, 4vw, 48px);
  background: rgba(255, 255, 255, 0.86);
  border-bottom: 1px solid rgba(23, 53, 42, 0.1);
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 14px;
  background: #25d366;
  color: #ffffff;
  font-size: 1.45rem;
  font-weight: 800;
  box-shadow: 0 16px 28px rgba(37, 211, 102, 0.24);
}

h1,
p {
  margin: 0;
}

.typing-message {
  margin: 0;
  padding: 0 clamp(16px, 4vw, 48px) 10px;
  color: #5a746b;
  font-size: 0.9rem;
  font-weight: 700;
}

.chat-title h1 {
  font-size: clamp(1.45rem, 3vw, 2.25rem);
  line-height: 1;
}

.chat-title p,
.chat-status {
  color: #5a746b;
  font-size: 0.92rem;
  font-weight: 700;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 14px;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(100%, 920px);
  margin: 0 auto;
  padding: 28px clamp(16px, 4vw, 32px);
  box-sizing: border-box;
  overflow-y: auto;
}

.message-row {
  display: flex;
}

.message-row.own {
  justify-content: flex-end;
}

.message-row.system {
  justify-content: center;
}

.message-bubble {
  max-width: min(72%, 560px);
  padding: 11px 13px 8px;
  border: 1px solid rgba(23, 53, 42, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 20px rgba(23, 53, 42, 0.08);
}

.message-row.own .message-bubble {
  background: #dcf8c6;
}

.message-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.message-user img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.message-bubble strong {
  display: block;
  margin-bottom: 5px;
  color: #128c7e;
  font-size: 0.85rem;
}

.message-bubble p {
  color: #17352a;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.message-bubble span {
  display: block;
  margin-top: 5px;
  color: #5a746b;
  font-size: 0.75rem;
  text-align: right;
}

.system-message {
  max-width: min(100%, 520px);
  padding: 7px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.75);
  color: #5a746b;
  font-size: 0.86rem;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 6px 14px rgba(23, 53, 42, 0.06);
}

.chat-form {
  display: flex;
  gap: 12px;
  padding: 16px clamp(16px, 4vw, 48px);
  background: rgba(255, 255, 255, 0.86);
  border-top: 1px solid rgba(23, 53, 42, 0.1);
}

.chat-form input {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid #bdd5cb;
  border-radius: 8px;
  padding: 14px 16px;
  background: #ffffff;
  color: #17352a;
  font: inherit;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.chat-form input:focus {
  border-color: #25d366;
  box-shadow: 0 0 0 4px rgba(37, 211, 102, 0.15);
}

button {
  border: 0;
  border-radius: 8px;
  padding: 14px 18px;
  background: #128c7e;
  color: #ffffff;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

button:hover {
  background: #0f7b6f;
  transform: translateY(-1px);
}

.logout-button {
  padding: 11px 14px;
  background: rgba(18, 140, 126, 0.1);
  color: #128c7e;
}

.logout-button:hover {
  background: rgba(18, 140, 126, 0.16);
}

@media (max-width: 680px) {
  .chat-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .chat-status {
    width: 100%;
    justify-content: space-between;
  }

  .message-bubble {
    max-width: 86%;
  }

  .chat-form {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .chat-status {
    align-items: stretch;
    flex-direction: column;
  }

  .logout-button {
    width: 100%;
  }
}
</style>
