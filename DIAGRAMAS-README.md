# Diagramas UML - GeoMaker

Este documento contém informações sobre os diagramas UML criados para a aplicação GeoMaker.

## Arquivos de Diagramas

1. **diagrama-caso-de-uso.puml** - Diagrama de Caso de Uso
2. **diagrama-classes.puml** - Diagrama de Classes

## Como Visualizar os Diagramas

Os diagramas foram criados em formato **PlantUML**. Você pode visualizá-los de várias formas:

### Opção 1: Online (Mais Rápido)

1. Acesse: https://www.plantuml.com/plantuml/uml/
2. Copie o conteúdo do arquivo `.puml`
3. Cole na caixa de texto
4. Clique em "Submit" para gerar o diagrama

### Opção 2: VS Code (Recomendado)

1. Instale a extensão "PlantUML" no VS Code
2. Abra o arquivo `.puml`
3. Pressione `Alt + D` (ou `Cmd + D` no Mac) para visualizar

### Opção 3: Ferramenta Local

1. Instale o PlantUML: https://plantuml.com/download
2. Execute: `java -jar plantuml.jar diagrama-caso-de-uso.puml`
3. Será gerado um arquivo PNG

## Resumo dos Diagramas

### Diagrama de Caso de Uso

Mostra as interações do **Estudante** com o sistema GeoMaker:

- **Navegação**: Acesso à landing page e dashboard
- **Laboratório de Triângulos**: Atividade interativa de construção de triângulos
  - Seleção de tipos (equilátero, isósceles, escaleno, retângulo, livre)
  - Manipulação de retas (arrastar, rotacionar, conectar)
  - Análise automática dos triângulos formados
- **Invasão Espacial**: Jogo educacional sobre posicionamento
  - Sistema de missões com copiloto Enzo
  - Identificação de naves por cor e posição (esquerda/direita)
  - Mecânica de acertos/erros

### Diagrama de Classes

Mostra a arquitetura orientada a objetos da aplicação:

**Classes Principais:**
- `App` e `Router`: Estrutura de navegação
- `LandingPage`, `Dashboard`: Interfaces de navegação
- `Workspace`: Laboratório de triângulos com drag-and-drop
- `SpacePosition`: Jogo da invasão espacial
- `Segmento`, `Nave`: Entidades do domínio
- `AnaliseTriangulo`: Lógica de validação geométrica

**Padrões de Design:**
- Composição: Dashboard contém Atividades, SpacePosition contém Naves
- Dependência: Componentes usam serviços de navegação
- Enumerações: TipoNave, Posicao, EstadoJogo

## Características Técnicas da Aplicação

- **Framework**: React 18.3.1 com TypeScript
- **Roteamento**: React Router 7.13.0
- **Estilização**: Tailwind CSS 4.1.12
- **Interatividade**: React DnD (drag-and-drop)
- **UI Components**: Radix UI, Lucide Icons
- **Animações**: Motion (Framer Motion)

## Conceitos Educacionais

### Laboratório de Triângulos
- Ensina propriedades dos triângulos
- Regra de existência (soma de dois lados > terceiro lado)
- Classificação: equilátero, isósceles, escaleno, retângulo
- Medidas em centímetros (escala: 1cm = 20 pixels)

### Invasão Espacial
- Conceitos de posicionamento espacial (esquerda/direita)
- Identificação por cor
- Lógica de dedução baseada em dicas
- Sistema de feedback imediato

---

**Criado para**: Documentação do projeto GeoMaker  
**Data**: Abril 2026
