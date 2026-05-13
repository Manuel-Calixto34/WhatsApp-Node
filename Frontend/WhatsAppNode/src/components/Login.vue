<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';


const router = useRouter();

const usuario = ref('');
const estado = ref('');
const avatares = [
  '/avatars/gatocorbata.jpg',
  '/avatars/gengaractually.jpg',
  '/avatars/sonicdj.jpg',
  '/avatars/usuario.jpg',
  '/avatars/invenciblewasap.jpg',
];
const avatar = ref(avatares[0]);

function iniciarSesion() {
  router.push({
  path: '/chat',
  query: {
    usuario: usuario.value,
    estado: estado.value,
    avatar: avatar.value,
  },
});
}
async function loginGoogle(){
const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  router.push({
    path: '/chat',
    query: {
      usuario: result.user.displayName || result.user.email,
      estado: 'Conectado con Google',
      avatar: result.user.photoURL || '/avatars/usuario.jpg',
    },
  });
}

async function loginGithub() {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);

  router.push({
    path: '/chat',
    query: {
      usuario: result.user.displayName || result.user.email,
      estado: 'Conectado con GitHub',
      avatar: result.user.photoURL || '/avatars/usuario.jpg',
    },
  });
}

</script>

<template>
  <main class="login-page">
    <section class="login-panel">
      <div class="brand">
        <span class="brand-icon">W</span>
        <div>
          <h1>WhatsApp Node</h1>
        </div>
      </div>

      <form class="login-form" @submit.prevent="iniciarSesion">
        <div class="form-header">
          <h2>Inicia sesión</h2>
          <p>Entra con tu nombre, estado (opcional) y un avatar para acceder a la aplicación.</p>
        </div>

        <label>
          Nombre
          <input
            v-model="usuario"
            type="text"
            name="usuario"
            placeholder="Ej. Pepe"
            autocomplete="username"
          />
        </label>

        <label>
          Estado
          <input
            v-model="estado"
            type="text"
            name="estado"
            placeholder="Ej. Estoy usando WhatsApp"
          />
        </label>

        <label>
          Avatar
        </label>

        <div class="avatar-list">
          <button
            v-for="avatarOption in avatares"
            :key="avatarOption"
            type="button"
            class="avatar-option"
            :class="{ selected: avatar === avatarOption }"
            @click="avatar = avatarOption"
          >
            <img :src="avatarOption" alt="Avatar" />
          </button>
        </div>

        <div class="social-login">
          <button type="button" class="social-button google-button" @click="loginGoogle">
            <span>Iniciar sesión con Google</span>
          </button>

          <button type="button" class="social-button github-button" @click="loginGithub">
            <span>Iniciar sesión con GitHub</span>
          </button>
        </div>

        <button type="submit">Entrar al chat</button>
      </form>
    </section>

    
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at top left, rgba(37, 211, 102, 0.18), transparent 34%),
    linear-gradient(135deg, #f5faf7 0%, #dff2e7 50%, #f7f7f4 100%);
  color: #17352a;
}

.login-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 48px;
  width: min(100%, 460px);
  padding: 48px clamp(24px, 6vw, 72px);
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(23, 53, 42, 0.1);
  border-radius: 8px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #25d366;
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 800;
  box-shadow: 0 16px 28px rgba(37, 211, 102, 0.26);
}

.eyebrow {
  margin: 0 0 4px;
  color: #5a746b;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1;
}

.login-form {
  display: grid;
  gap: 20px;
}

.form-header {
  display: grid;
  gap: 8px;
}

.form-header h2 {
  font-size: 1.65rem;
}

.form-header p {
  color: #5a746b;
  line-height: 1.5;
}

.login-form label {
  display: grid;
  gap: 8px;
  color: #24483c;
  font-size: 0.95rem;
  font-weight: 700;
}

input {
  width: 100%;
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

input:focus {
  border-color: #25d366;
  box-shadow: 0 0 0 4px rgba(37, 211, 102, 0.15);
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #5a746b;
  font-size: 0.9rem;
}

.check {
  display: flex;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.check input {
  width: 18px;
  height: 18px;
  accent-color: #25d366;
}

a {
  color: #128c7e;
  font-weight: 700;
  text-decoration: none;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 15px 18px;
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

.avatar-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  gap: 12px;
}

.avatar-option {
  width: 100%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: #eef7f2;
}

.avatar-option:hover {
  background: #e0f2e9;
  transform: translateY(-1px);
}

.avatar-option.selected {
  border-color: #128c7e;
  background: rgba(37, 211, 102, 0.16);
}

.avatar-option img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.social-login {
  display: grid;
  gap: 12px;
}

.social-button {
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid transparent;
  padding: 13px 16px;
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(23, 53, 42, 0.08);
}

.social-button:hover {
  transform: translateY(-1px);
}

.social-button:focus-visible {
  outline: 3px solid rgba(37, 211, 102, 0.24);
  outline-offset: 2px;
}

.social-icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: 900;
}

.google-button {
  border-color: #d8e0dc;
  background: #ffffff;
  color: #17352a;
}

.google-button:hover {
  border-color: #b9cbc3;
  background: #f8fbf9;
}

.google-button .social-icon {
  background: #f1f5f3;
  color: #db4437;
}

.github-button {
  border-color: #1f2937;
  background: #111827;
  color: #ffffff;
}

.github-button:hover {
  border-color: #0b1220;
  background: #0b1220;
}

.github-button .social-icon {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

@media (max-width: 820px) {
  .login-panel {
    border: 1px solid rgba(23, 53, 42, 0.1);
  }
}

@media (max-width: 520px) {
  .login-panel {
    gap: 34px;
    padding: 32px 20px;
  }

  .brand {
    align-items: flex-start;
  }

  .form-options {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
