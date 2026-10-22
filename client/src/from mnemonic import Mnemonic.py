from mnemonic import Mnemonic
from bip32utils import BIP32Key


# -------------------------------
# Part A: Generate Mnemonic
# -------------------------------

mnemo = Mnemonic("english")

# Generate a 12-word mnemonic phrase
mnemonic_phrase = mnemo.generate(strength=128)

print("12-Word Mnemonic:")
print(mnemonic_phrase)


# -------------------------------
# Part B: Generate Seed
# -------------------------------

# Convert mnemonic into a 512-bit (64-byte) seed
seed = mnemo.to_seed(mnemonic_phrase)

print("\n512-bit Seed:")
print(seed.hex())


# -------------------------------
# Part C: Generate Wallet Keys
# -------------------------------

# Generate master private key from seed
master_key = BIP32Key.fromEntropy(seed)

# Get private key
private_key = master_key.PrivateKey()

# Get public key
public_key = master_key.PublicKey()

print("\nMaster Private Key:")
print(private_key.hex())

print("\nMaster Public Key:")
print(public_key.hex())


# -------------------------------
# Part D: Analysis
# -------------------------------

print("\nAnalysis:")
print("Mnemonic length:", len(mnemonic_phrase.split()), "words")
print("Seed length:", len(seed) * 8, "bits")
print("Private key length:", len(private_key) * 8, "bits")