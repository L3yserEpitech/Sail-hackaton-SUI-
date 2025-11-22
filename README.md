# ⚡ Sui-FlashBuilder

[![Sui Network](https://img.shields.io/badge/Sui-Network-blue?style=flat-square)](https://sui.io/)

Sui-FlashBuilder est une infrastructure DeFi **No-Code** révolutionnaire sur la blockchain Sui.
Elle permet à quiconque de **construire, visualiser et exécuter des stratégies d'arbitrage complexes (Flash Loans)** via une interface *Drag-and-Drop*, **sans écrire une seule ligne de code Move**.

En plus d'être un outil d'exécution, c'est une **Marketplace de Stratégies**.
Les créateurs (MEV searchers, traders) peuvent encapsuler leur logique dans des **Custom Blocks**, les chiffrer et les vendre de manière sécurisée.

---

## 🚀 Pourquoi Sui-FlashBuilder ?

Sur Ethereum, les Flash Loans sont réservés aux développeurs Solidity experts.
Sur Sui, grâce aux **Programmable Transaction Blocks (PTB)**, ils deviennent accessibles à tous.

### Problèmes résolus

| Problème                                   | Solution apportée                                                |
| ------------------------------------------ | ---------------------------------------------------------------- |
| Complexité technique du pattern Hot Potato | L’UI gère automatiquement l’emprunt et le remboursement atomique |
| Impossibilité de monétiser son alpha       | Chiffrement et vente sécurisée via NFTs / Seal                   |
| Risque de perte en cas d’échec             | Transaction annulée automatiquement (atomicité PTB)              |

---

## 🏗️ Architecture Technique

### 1. Moteur PTB (Client-Side)

Pas de smart contract central.
L’utilisateur assemble côté client une seule transaction avec toutes les actions DeFi.

* **Entrée** : JSON généré par l’interface
* **Sortie** : PTB atomique envoyé on-chain
* **Sécurité** : Pattern *Hot Potato* — obligatoire bloc de remboursement

### 2. Intégrations DeFi

**Liquidité (Flash Loans)**

* Scallop
* Bucket
* DeepBook

**Swaps (DEXs)**

* Cetus (CLMM)
* DeepBook
* Smart Router

### 3. Stockage & Confidentialité

| Technologie | Usage                                         |
| ----------- | --------------------------------------------- |
| Walrus      | Stockage immuable des stratégies (JSON Blobs) |
| Seal        | Chiffrement et contrôle d'accès via NFT       |

---

## 🛠️ Stack Technologique

**Frontend**

* React, TypeScript, TailwindCSS
* React Flow (visualisation nodale)

**Blockchain Interaction**

* `@mysten/dapp-kit` (wallet)
* `@mysten/sui` (PTB construction)

**DeFi SDKs**

* `@naviprotocol/lending`
* `@scallop-io/sui-scallop-sdk`
* `@cetusprotocol/cetus-sui-clmm-sdk`
* `@mysten/deepbook-v3`

**Infrastructure**

* Walrus SDK (stockage)
* Seal SDK (chiffrement / déchiffrement conditionnel)

---

## 📦 Installation & Démarrage

### Prérequis

* Node.js ≥ 18
* pnpm (recommandé)
* Wallet Sui (Sui Wallet, Ethos, etc.)
* Fonds Testnet

### Installation

```bash
git clone <repo-url>
cd sui-flashbuilder
pnpm install
```

### Configuration

Créer un fichier `.env` à la racine du projet (variables Sui, Walrus, Seal, etc.)

### Lancer l'app

```bash
pnpm dev
```

Accessible sur : `http://localhost:3000`

---

## 💡 Guide d'Utilisation (Scénario Hackathon)

1️⃣ **Créer une stratégie**

* Blocs : Flash Loan (Navi) → Swap (Cetus) → Swap (DeepBook) → Rembourser
* Connecter le *Reçu de Prêt* (Hot Potato) au bloc de remboursement

2️⃣ **Simuler**

* Le système exécute `dryRunTransaction`
* Retour : `Profit estimé : +5 SUI` ou échec

3️⃣ **Publier (Marketplace)**

* Chiffrement via Seal
* Upload sur Walrus
* Mint d’un NFT contenant l'accès

---

## ⚠️ Avertissements & Risques

* **Slippage & conditions de marché variables**
* **Aucune perte de capital possible sur échec (atomicité)**
* **Prototype non audité — à utiliser uniquement sur Testnet**

---

## 🤝 Contribution

Pull Requests bienvenues !

Axes d'amélioration :

* Intégration de nouveaux protocoles (Suilend, Bluefin)
* UX Builder (auto-connect des nœuds)
* Graphiques de prix en temps réel

---

## 📜 Licence

Distribué sous licence **MIT**.
Voir le fichier `LICENSE` pour plus d'informations.

---

💙 Built with passion during the **Sui Hackathon**
