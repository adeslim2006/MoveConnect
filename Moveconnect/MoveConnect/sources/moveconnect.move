module moveconnect::moveconnect {
    use std::string::{String};
    use std::vector;

    // --- Structs ---

    public struct Profile has key, store {
        id: UID,
        name: String,
        bio: String,
        twitter: String,
        linkedin: String,
        avatar_url: String,
        connections: vector<address>, // Store your connectionss' addresses
    }

    /// A shared registry that tracks ALL users (Global registry)
    public struct State has key {
        id: UID,
        users: vector<address>,
    }

    //  Init

    fun init(ctx: &mut TxContext) {
        transfer::share_object(State {
            id: object::new(ctx),
            users: vector::empty(),
        });
    }

    // Functions and Functionalities

    public fun create_profile(
        state: &mut State,
        name: String,
        bio: String,
        twitter: String,
        linkedin: String,
        avatar_url: String,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();

        // Add to the global listt
        vector::push_back(&mut state.users, sender);

        // for creating a users' profile with empty connections list
        let profile = Profile {
            id: object::new(ctx),
            name,
            bio,
            twitter,
            linkedin,
            avatar_url,
            connections: vector::empty() // <--- Initialize empty list
        };

        transfer::public_transfer(profile, sender);
    }

    public fun add_connection(
        profile: &mut Profile,
        new_connection: address,
        _ctx: &mut TxContext
    ) {
        //  check if user profile already connected, in order to to prevent duplicates
        if (!vector::contains(&profile.connections, &new_connection)) {
            vector::push_back(&mut profile.connections, new_connection);
        };
    }
}