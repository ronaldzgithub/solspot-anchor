
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


  /*

  const initProfile = async (user) => {
    const profile = anchor.web3.Keypair.generate();
    await program.rpc.initialize({
      accounts: {
        profile: profile.publicKey,
        user,
        systemProgram: SystemProgram.programId,
      },
      signers: [profile],
    });

    return profile
  }





  it('init account, add bio, add link', async () => {
    // Create they keypair for the profile program
    const profile_address = anchor.web3.Keypair.generate();

    // our program provider wallet (me)
    const user = program.provider.wallet.publicKey;

    // inits the profile program with the keypair and the user account
    await program.rpc.initialize({
      accounts: {
        profile: profile_address.publicKey,
        user: user,
        systemProgram: SystemProgram.programId,
      },
      signers: [profile_address],
    });

    // gets specific profile we just created
    let profile_data = await program.account.profile.fetch(profile_address.publicKey);
    //console.log(profile_data)

    // asserts this profile
    assert.equal(profile_data.bio, '');
    assert.equal(profile_data.user.toBase58(), user.toBase58());


    // update the profile
    await program.rpc.updateBio('This is my bio', {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // get specific profile after being updated
    profile_data = await program.account.profile.fetch(profile_address.publicKey);
    //console.log(profile_data)

    // asserts this profile
    assert.equal(profile_data.bio, 'This is my bio');
    assert.equal(profile_data.user.toBase58(), user.toBase58());



    // add a link.
    await program.rpc.addLink('Link Name', "Link URL", {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // Ensure the updated tweet has the updated data.
    profile_data = await program.account.profile.fetch(profile_address.publicKey);
    //console.log(profile_data);


    assert.equal(profile_data.linkList[0].name, 'Link Name');
    assert.equal(profile_data.linkList[0].url, 'Link URL');
  });



  it('can create new account', async () => {
    // Call the "SendTweet" instruction.
    const profile_address = anchor.web3.Keypair.generate();

    await program.rpc.initialize({
      accounts: {
        profile: profile_address.publicKey,
        user: program.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [profile_address],
    });

    // Fetch the account details of the created tweet.
    const profile_data = await program.account.profile.fetch(profile_address.publicKey);

    // Ensure it has the right data.
    assert.equal(profile_data.user.toBase58(), program.provider.wallet.publicKey.toBase58());



  });



  it('cannot provide a bio with more than 140 characters...', async () => {
    try {
      const profile_address = anchor.web3.Keypair.generate();
      const user = program.provider.wallet.publicKey;

      await program.rpc.initialize({
        accounts: {
          profile: profile_address.publicKey,
          user: program.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [profile_address],
      });


      const profile_data = await program.account.profile.fetch(profile_address.publicKey);
      //console.log(profile_data)

      // update the profile
      const bioWith140Chars = 'x'.repeat(141);
      await program.rpc.updateBio(bioWith140Chars, {
        accounts: {
          profile: profile_address.publicKey,
          user,
        },
      });
    } catch (error) {
      assert.equal(error.msg, 'The provided bio should be 140 characters long maximum.');
      return;
    }
    assert.fail('The provided bio should be 140 characters long maximum. !!!');

  });




  it('add links and delete one', async () => {
    // Create they keypair for the profile program
    const profile_address = anchor.web3.Keypair.generate();
    const bioWith140Chars = 'x'.repeat(140);
    const urlName = 'y'.repeat(50);
    const url = 'z'.repeat(200);
    // our program provider wallet (me)
    const user = program.provider.wallet.publicKey;

    // inits the profile program with the keypair and the user account
    await program.rpc.initialize({
      accounts: {
        profile: profile_address.publicKey,
        user: user,
        systemProgram: SystemProgram.programId,
      },
      signers: [profile_address],
    });

    // gets specific profile we just created
    let profile_data = await program.account.profile.fetch(profile_address.publicKey);
    //console.log(profile_data)

    // asserts this profile
    assert.equal(profile_data.bio, '');
    assert.equal(profile_data.user.toBase58(), user.toBase58());


    // update the profile
    await program.rpc.updateBio(bioWith140Chars, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // get specific profile after being updated
    profile_data = await program.account.profile.fetch(profile_address.publicKey);
    //console.log(profile_data)

    // asserts this profile
    assert.equal(profile_data.bio, bioWith140Chars);
    assert.equal(profile_data.user.toBase58(), user.toBase58());



    // add a link.
    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // add a link.
    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // add a link.
    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // add a link.
    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // add a link.
    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // add a link.
    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },

    });


    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // add a link.
    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    await program.rpc.addLink(urlName, url, {
      accounts: {
        profile: profile_address.publicKey,
        user,
      },

    });


    // Ensure the updated tweet has the updated data.
    profile_data = await program.account.profile.fetch(profile_address.publicKey);
    console.log(profile_address.publicKey.toBase58())
    console.log(profile_data)
    console.log(profile_data.linkList)

  });




  it('can? filter profiles by user', async () => {
    const user = program.provider.wallet.publicKey
    const profiles = await program.account.profile.all([
      {
        memcmp: {
          offset: 8, // Discriminator.
          bytes: user.toBase58(),
        }
      }
    ]);

    console.log(profiles);
    //console.log(profiles[0].account.user.toBase58());
  });


  it('can delete a profile', async () => {
    // Create a new tweet.
    const user = program.provider.wallet.publicKey;
    const profile_address = await initProfile(user);

    // Delete the Tweet.
    await program.rpc.deleteProfile({
      accounts: {
        profile: profile_address.publicKey,
        user,
      },
    });

    // Ensure fetching the tweet account returns null.
    const profileAccount = await program.account.profile.fetchNullable(profile_address.publicKey);
    assert.ok(profileAccount === null);
  });
  */

  it('can init and construct a profile', async () => {
    // Create a new tweet.
    const user = program.provider.wallet.publicKey;
    const profile_address = anchor.web3.Keypair.generate();

    await program.rpc.initialize({
      accounts: {
        profile: profile_address.publicKey,
        user,
        systemProgram: SystemProgram.programId,
      },
      signers: [profile_address],
    });


    let profileObj = {
      bio: "My constructed bio",
      link_list: [
        { "name": "my constructed name", "url": "constructed url" },
        { "name": "my constructed name 2", "url": "constructed url 2" },
      ]
    }



    profileAccount = await program.account.profile.fetch(profile_address.publicKey);
    console.log(profileAccount)
  });

});
