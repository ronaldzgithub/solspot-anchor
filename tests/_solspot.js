
const anchor = require('@project-serum/anchor');
// import { Program } from '@project-serum/anchor';
const { SystemProgram } = anchor.web3;
const assert = require('assert');

describe('solspot', () => {
  console.log("Starting test...")


  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solspot;

  const createProfile = async (user, bio) => {
    const profile = anchor.web3.Keypair.generate();
    await program.rpc.createProfile(bio, {
      accounts: {
        profile: profile.publicKey,
        user,
        systemProgram: SystemProgram.programId,
      },
      signers: [profile],
    });

    return profile
  }



  it('can create new account', async () => {
    // Call the "SendTweet" instruction.
    const profile = anchor.web3.Keypair.generate();
    await program.rpc.createProfile("GM. This is my initial BIO!", {
      accounts: {
        profile: profile.publicKey,
        user: program.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [profile],
    });

    // Fetch the account details of the created tweet.
    const profileAccount = await program.account.profile.fetch(profile.publicKey);

    // Ensure it has the right data.
    assert.equal(profileAccount.user.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(profileAccount.bio, 'GM. This is my initial BIO!');
  });





  it('can update the bio', async () => {
    const user = program.provider.wallet.publicKey;
    const profile = await createProfile(user, 'This is my 1.5 BIO!');
    const profileAccount = await program.account.profile.fetch(profile.publicKey);
    console.log(profileAccount);

    // Ensure it has the right data.
    assert.equal(profileAccount.bio, 'This is my 1.5 BIO!');

    // Update the Tweet.
    await program.rpc.updateProfile('This is my 2.5 BIO!', {
      accounts: {
        profile: profile.publicKey,
        user,
      },
    });

    // Ensure the updated tweet has the updated data.
    const updatedProfile = await program.account.profile.fetch(profile.publicKey);
    assert.equal(updatedProfile.bio, 'This is my 2.5 BIO!');
    console.log(updatedProfile);
  });


  it('can add link', async () => {
    const user = program.provider.wallet.publicKey;
    const profile = await createProfile(user, 'INIT BIO for Link');
    const profileAccount = await program.account.profile.fetch(profile.publicKey);
    console.log(profileAccount);

    // Ensure it has the right data.
    assert.equal(profileAccount.bio, 'INIT BIO for Link');

    // Update the Tweet.
    await program.rpc.addLink('Link Name', "Link URL", {
      accounts: {
        profile: profile.publicKey,
        user,
      },
    });

    // Ensure the updated tweet has the updated data.
    const updatedProfile = await program.account.profile.fetch(profile.publicKey);

    console.log(updatedProfile);
  });


  it('can? filter profiles by user', async () => {
    const user = program.provider.wallet.publicKey
    const profileAccounts = await program.account.profile.all([
      {
        memcmp: {
          offset: 8, // Discriminator.
          bytes: user.toBase58(),
        }
      }
    ]);

    console.log(profileAccounts);
  });


});
