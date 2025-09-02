export type Lang = 'pt' | 'en';
export const dict = {
  "pt": {
    "app": {
      "title": "KidLearn Max",
      "footer": "Matheus Reis – Todos os direitos reservados © 2025"
    },
    "nav": {
      "dashboard": "Dashboard",
      "students": "Pacientes",
      "activities": "Atividades",
      "logout": "Sair",
      "login": "Entrar",
      "register": "Cadastrar"
    },
    "auth": {
      "email": "E-mail",
      "password": "Senha",
      "name": "Nome",
      "enter": "Entrar",
      "create": "Criar conta",
      "haveAccount": "Já possui conta? Entrar",
      "noAccount": "Não possui conta? Criar conta"
    },
    "students": {
      "title": "Pacientes",
      "add": "Adicionar Paciente",
      "name": "Nome",
      "age": "Idade",
      "avatar": "Avatar",
      "boy": "Menino",
      "girl": "Menina",
      "save": "Salvar",
      "selectStudent": "Selecionar"
    },
    "dashboard": {
      "welcome": "Bem-vindo(a), {{name}}!",
      "chooseStudent": "Selecione um Paciente para começar.",
      "openActivities": "Abrir Atividades"
    },
    "activities": {
      "aac": "AAC (Comunicação)",
      "emotions": "Emoções",
      "routines": "Rotinas Visuais",
      "colors": "Cores",
      "numbers": "Números",
      "letters": "Letras",
      "memory": "Memória",
      "puzzle": "Quebra-cabeça"
    }
  },
  "en": {
    "app": {
      "title": "KidLearn Max",
      "footer": "Matheus Reis – All rights reserved © 2025"
    },
    "nav": {
      "dashboard": "Dashboard",
      "students": "Students",
      "activities": "Activities",
      "logout": "Logout",
      "login": "Login",
      "register": "Register"
    },
    "auth": {
      "email": "Email",
      "password": "Password",
      "name": "Name",
      "enter": "Login",
      "create": "Create account",
      "haveAccount": "Have an account? Login",
      "noAccount": "Don't have an account? Sign up"
    },
    "students": {
      "title": "Students",
      "add": "Add Student",
      "name": "Name",
      "age": "Age",
      "avatar": "Avatar",
      "boy": "Boy",
      "girl": "Girl",
      "save": "Save",
      "selectStudent": "Select"
    },
    "dashboard": {
      "welcome": "Welcome, {{name}}!",
      "chooseStudent": "Select a student to start.",
      "openActivities": "Open Activities"
    },
    "activities": {
      "aac": "AAC (Communication)",
      "emotions": "Emotions",
      "routines": "Visual Routines",
      "colors": "Colors",
      "numbers": "Numbers",
      "letters": "Letters",
      "memory": "Memory",
      "puzzle": "Puzzle"
    }
  }
} as const;
export function t(lang: Lang, path: string, vars: Record<string, any> = {}){ const parts = path.split('.'); let cur: any = (dict as any)[lang]; for(const p of parts) cur = cur?.[p]; if(typeof cur==='string'){ return cur.replace(/\{\{(.*?)\}\}/g, (_: any, k: string)=> (vars as any)[k.trim()] ?? ''); } return path }
